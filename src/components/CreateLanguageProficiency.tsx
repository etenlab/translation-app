import { useMutation } from "@apollo/client";
import {
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonModal,
    IonNote,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
    useIonToast,
} from "@ionic/react";
import { useKeycloak } from "@react-keycloak/web";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import Button from "../common/Button";
import { iso_639_3_enum } from "../common/iso_639_3_enum";
import {
    createLanguageProficiencyMutation,
    languageProficienciesByUserIdQuery,
} from "../common/queries";
import Title from "../common/Title";
import { Virtuoso } from "react-virtuoso";
import { skillLevelEnum } from "./LanguageProficiencyv2";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

const schema = object().shape({
    language_id: string().required(),
    skill_level: string().required(),
});

interface ILanguageProficiencyForm {
    language_id: string;
    skill_level: string;
}

const CreateLanguageProficiency = () => {
    const {
        handleSubmit,
        formState: { errors },
        register,
        reset,
        setValue,
        watch,
    } = useForm<ILanguageProficiencyForm>({
        resolver: yupResolver(schema),
    });

    const history = useHistory();
    const [present] = useIonToast();
    const { keycloak } = useKeycloak();

    const iso_639_3_options = useMemo(() => Object.values(iso_639_3_enum), []);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [langId, setLangId] = useState<string | undefined>("");
    const [results, setResults] = useState<string[]>([...iso_639_3_options]);
    const [userId, setUserId] = useState<string>("");

    const [createLanguageProficiency] = useMutation(
        createLanguageProficiencyMutation
    );

    useEffect(() => {
        loadUserInfo();
        async function loadUserInfo() {
            const res = await keycloak.loadUserInfo();
            //@ts-expect-error
            setUserId(res.preferred_username);
            // setUserId(res.sub)
        }
    }, [keycloak]);

    const handleChange = (iso: string) => {
        let query = iso.toLowerCase();

        setResults(
            iso_639_3_options.filter((i) => i.toLowerCase().indexOf(query) > -1)
        );
    };

    const handleFormSubmit = (
        languageProficiencyForm: ILanguageProficiencyForm
    ) => {
        createLanguageProficiency({
            variables: {
                input: {
                    language_id: languageProficiencyForm.language_id,
                    language_table: "iso_639_3",
                    skill_level: languageProficiencyForm.skill_level,
                    user_id: userId,
                },
            },
            update: (cache, result) => {
                const cached = cache.readQuery({
                    query: languageProficienciesByUserIdQuery,
                    variables: { userId },
                    returnPartialData: true,
                });
                cache.writeQuery({
                    query: languageProficienciesByUserIdQuery,
                    variables: { userId },
                    data: {
                        //@ts-expect-error
                        ...cached,
                        languageProfienciesByUserId: [
                            //@ts-expect-error
                            ...(cached.languageProfienciesByUserId ?? []),
                            result.data.createLanguageProficiency,
                        ],
                    },
                });
            },
            onCompleted: () => {
                present({
                    message: "Language proficiency created successfully",
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

    console.log(errors);

    return (
        <IonContent>
            <div style={{ padding: "60px 20px 60px 20px" }}>
                <Title title="Add Language Proficiency" />

                <div style={{ paddingTop: "10px", paddingBottom: "10px" }}>
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

                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div>
                        <IonItem
                            lines="none"
                            className={`form ${
                                "skill_level" in errors
                                    ? "ion-invalid"
                                    : "ion-valid"
                            }`}
                        >
                            <IonSelect
                                {...register("skill_level")}
                                placeholder="Proficiency Level"
                                onIonChange={(e) =>
                                    e.target.value.replace(" ", "")
                                }
                                value={watch("skill_level")}
                            >
                                {Object.entries(skillLevelEnum).map(
                                    ([skill, value]) => (
                                        <IonSelectOption
                                            value={skill.replace(" ", "")}
                                            key={value}
                                        >
                                            {skill}
                                        </IonSelectOption>
                                    )
                                )}
                            </IonSelect>
                            <IonNote slot="error">
                                {errors.skill_level?.message}
                            </IonNote>
                        </IonItem>
                    </div>

                    <div className="button-container">
                        <Button
                            label="Cancel"
                            color="light"
                            onClick={() =>
                                history.push(
                                    `/translation-app/language-proficiency/v2`
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

export default CreateLanguageProficiency;
