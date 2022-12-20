import {
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonModal,
    IonNote,
    IonSearchbar,
    IonText,
    IonTextarea,
    IonTitle,
    IonToolbar,
    useIonToast,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router";
import queryString from "query-string";
import Title from "../common/Title";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import {
    createElectionMutation,
    createSiteTextMutation,
    siteTextsByAppIdQuery,
} from "../common/queries";
import Button from "../common/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import { iso_639_3_enum } from "../common/iso_639_3_enum";
import { Virtuoso } from "react-virtuoso";
import { useEffect, useMemo, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";

const schema = object().shape({
    site_text_key: string().min(5).max(256).required(),
    description: string().min(5).max(256).required(),
    language_id: string().required(),
});

export interface ISiteTextForm {
    site_text_key: string;
    description: string;
    language_id: string;
}

const CreateSiteText = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<ISiteTextForm>({
        resolver: yupResolver(schema),
    });

    const [present] = useIonToast();
    const history = useHistory();
    const { search } = useLocation();
    const { keycloak } = useKeycloak();
    const params = queryString.parse(search);

    const iso_639_3_options = useMemo(() => Object.values(iso_639_3_enum), []);
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [langId, setLangId] = useState<string | undefined>("");
    const [results, setResults] = useState<string[]>([...iso_639_3_options]);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [createSiteText] = useMutation(createSiteTextMutation);
    const [createElection] = useMutation(createElectionMutation);

    const handleChange = (iso: string) => {
        let query = iso.toLowerCase();

        setResults(
            iso_639_3_options.filter((i) => i.toLowerCase().indexOf(query) > -1)
        );
    };

    useEffect(() => {
        loadUserInfo();
        async function loadUserInfo() {
            const res = await keycloak.loadUserInfo();
            //@ts-expect-error
            setUserId(res.preferred_username);
        }
    }, [keycloak]);

    const handleSubmitForm = (siteTextForm: ISiteTextForm) => {
        createSiteText({
            variables: {
                input: {
                    app: +params.app!,
                    description: siteTextForm.description,
                    site_text_key: siteTextForm.site_text_key,
                    language_id: siteTextForm.language_id,
                    language_table: "iso_639_3",
                },
            },
            update: (cache, result) => {
                createElection({
                    variables: {
                        input: {
                            app_id: +params.app!,
                            name: siteTextForm.site_text_key,
                            created_by: userId,
                            table_name: "site_text_keys",
                            row: result.data.createSiteText.siteText.id,
                        },
                    },
                });
                const cached = cache.readQuery({
                    query: siteTextsByAppIdQuery,
                    optimistic: true,
                    variables: { siteTextsByAppId: +params.app! },
                    returnPartialData: true,
                });
                cache.writeQuery({
                    query: siteTextsByAppIdQuery,
                    variables: { siteTextsByAppId: +params.app! },
                    data: {
                        //@ts-expect-error
                        ...cached,
                        siteTextsByApp: [
                            //@ts-expect-error
                            ...(cached.siteTextsByApp ?? []),
                            result.data.createSiteText,
                        ],
                    },
                });
            },

            onCompleted: () => {
                present({
                    message: "Site text created successfully",
                    duration: 1500,
                    color: "success",
                });
                setLangId(undefined);
                reset();
            },
            onError: (e) => {
                present({
                    message: e.message,
                    duration: 1500,
                    color: "danger",
                });
            },
        });
    };

    return (
        <IonContent>
            <div style={{ padding: "70px 20px 20px 20px" }}>
                <IonText className="font-subtitle">{params.app_name}</IonText>
                <Title title="Add New Site Text" />
            </div>

            <div style={{ padding: "0px 20px 0px 20px" }}>
                <div>
                    <IonButton
                        expand="block"
                        color="light"
                        className="lang"
                        onClick={() => setIsOpen(true)}
                    >
                        <span
                            style={{ marginRight: "auto" }}
                            className="font-language"
                        >
                            {langId
                                ? iso_639_3_enum[langId]
                                : "Choose Language"}
                        </span>
                    </IonButton>
                    <IonNote
                        color="danger"
                        slot="end"
                        style={{ fontSize: "12px", paddingLeft: "15px" }}
                    >
                        {errors.language_id?.message}
                    </IonNote>
                </div>
                <IonModal
                    isOpen={isOpen}
                    onWillDismiss={() => setIsOpen(false)}
                >
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Choose Language</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <div style={{ height: "100%" }}>
                            <IonSearchbar
                                debounce={1000}
                                onIonChange={(e) => {
                                    setLangId(undefined);
                                    handleChange(e.target.value!);
                                }}
                            />
                            <Virtuoso
                                style={{ height: "84%" }}
                                data={results}
                                itemContent={(_, item) => {
                                    const value = Object.keys(
                                        iso_639_3_enum
                                    ).find(
                                        (key: string) =>
                                            iso_639_3_enum[key] === item
                                    );
                                    return (
                                        <IonItem
                                            key={item}
                                            style={{
                                                opacity:
                                                    value === langId
                                                        ? undefined
                                                        : 0.5,
                                            }}
                                            onClick={() => {
                                                setLangId(value);
                                            }}
                                        >
                                            {item}
                                        </IonItem>
                                    );
                                }}
                            />

                            <div className="button-container">
                                <Button
                                    label="Cancel"
                                    color="light"
                                    onClick={() => {
                                        setIsOpen(false);
                                        setResults([...iso_639_3_options]);
                                    }}
                                />
                                <Button
                                    label="Confirm"
                                    onClick={() => {
                                        if (langId) {
                                            setValue("language_id", langId);
                                            setIsOpen(false);
                                            setResults([...iso_639_3_options]);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </IonContent>
                </IonModal>

                <form onSubmit={handleSubmit(handleSubmitForm)}>
                    <div>
                        <Controller
                            control={control}
                            name="site_text_key"
                            render={({ field: { onChange, value } }) => (
                                <IonItem
                                    lines="none"
                                    className={`form ${
                                        "site_text_key" in errors
                                            ? "ion-invalid"
                                            : "ion-valid"
                                    }`}
                                >
                                    <IonInput
                                        placeholder="New Site Text"
                                        onIonChange={onChange}
                                        value={value}
                                    />
                                    <IonNote slot="error">
                                        {errors.site_text_key?.message}
                                    </IonNote>
                                </IonItem>
                            )}
                        />
                    </div>

                    <div style={{ padding: "10px 0px 0px 0px" }}>
                        <div>
                            <Controller
                                control={control}
                                name="description"
                                render={({ field: { onChange, value } }) => (
                                    <IonItem
                                        lines="none"
                                        className={`form ${
                                            "description" in errors
                                                ? "ion-invalid"
                                                : "ion-valid"
                                        }`}
                                    >
                                        <IonTextarea
                                            autoGrow
                                            rows={5}
                                            placeholder="Description"
                                            onIonChange={onChange}
                                            value={value}
                                        />
                                        <IonNote slot="error">
                                            {errors.description?.message}
                                        </IonNote>
                                    </IonItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="button-container">
                        <Button
                            label="Cancel"
                            color="light"
                            onClick={() =>
                                history.push(
                                    `/translation-app/apps/?app_id=${+params.app!}`
                                )
                            }
                        />
                        <Button label="Add New +" type="submit" />
                    </div>
                </form>
            </div>
        </IonContent>
    );
};

export default CreateSiteText;
