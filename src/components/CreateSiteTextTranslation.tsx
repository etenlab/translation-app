import {
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonNote,
    IonSelect,
    IonSelectOption,
    IonText,
    IonTextarea,
    useIonToast,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useHistory, useLocation } from "react-router";
import queryString from "query-string";
import Title from "../common/Title";
import { Controller, useForm } from "react-hook-form";
import {
    createSiteTextTranslationMutation,
    languageProficienciesByUserIdQuery,
    siteTextQuery,
} from "../common/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Button from "../common/Button";
import { iso_639_3_enum } from "../common/iso_639_3_enum";
import { useKeycloak } from "@react-keycloak/web";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

const schema = object().shape({
    site_text_translation: string().min(5).max(25).required(),
    description_translation: string().min(5).max(256).required(),
    language_id: string().required(),
});

export interface ISiteTextTranslationForm {
    site_text_translation: string;
    description_translation: string;
    language_id: string;
}

export interface ILanguageProficiency {
    id: number;
    language_id: number;
    language_table: string;
    ref_name: string;
    skill_level: string;
    user_id: string;
}

const CreateSiteTextTranslation = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        register,
        reset,
        watch,
    } = useForm<ISiteTextTranslationForm>({
        resolver: yupResolver(schema),
    });

    const { search } = useLocation();
    const { keycloak } = useKeycloak();
    const [present] = useIonToast();
    const history = useHistory();
    const params = queryString.parse(search);

    const [userId, setUserId] = useState<string>("");
    const [iso6393Options, setIso6393Options] = useState<string[]>([]);

    const [createSiteTextTranslation] = useMutation(
        createSiteTextTranslationMutation
    );

    const { data: languageProficiencies } = useQuery(
        languageProficienciesByUserIdQuery,
        {
            skip: !!!userId,
            variables: {
                userId: userId,
            },
        }
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

    useEffect(() => {
        if (languageProficiencies?.languageProfienciesByUserId)
            setIso6393Options(
                languageProficiencies?.languageProfienciesByUserId.map(
                    (lang: ILanguageProficiency) => lang.ref_name
                )
            );
    }, [languageProficiencies?.languageProfienciesByUserId]);

    const { data } = useQuery(siteTextQuery, {
        skip: +params.site_text_id! === undefined,
        variables: {
            siteTextId: +params.site_text_id!,
        },
    });

    const handleSubmitForm = (
        siteTextTranslationForm: ISiteTextTranslationForm
    ) => {
        createSiteTextTranslation({
            variables: {
                input: {
                    site_text: data?.siteText.id,
                    site_text_translation:
                        siteTextTranslationForm.site_text_translation,
                    language_id: siteTextTranslationForm.language_id,
                    language_table: "iso_639_3",
                    user_id: userId,
                    description_translation:
                        siteTextTranslationForm.description_translation,
                },
            },
            onCompleted: () => {
                present({
                    message: "Site text translation created successfully",
                    duration: 1500,
                    color: "success",
                });
                reset();
            },
            onError: (e: { message: any }) => {
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
            <div style={{ padding: "60px 20px 60px 20px" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <IonIcon
                        className="back"
                        icon={arrowBack}
                        onClick={() =>
                            history.push(
                                `/translation-app/site_texts?site_text_id=${params.site_text_id}`
                            )
                        }
                    />
                    <Title title="Add New Translation" />
                </div>
                <div
                    style={{
                        backgroundColor: "#D9D9D9",
                        opacity: 0.5,
                        height: "50px",
                        borderRadius: "10px",
                        display: "flex",
                    }}
                >
                    <IonText
                        className="font-description"
                        style={{
                            alignSelf: "center",
                            paddingLeft: "15px",
                        }}
                    >
                        {data?.siteText.site_text_key}
                    </IonText>
                </div>
                <div style={{ paddingTop: "20px" }}>
                    <IonText>{data?.siteText.description}</IonText>
                </div>
                <form onSubmit={handleSubmit(handleSubmitForm)}>
                    <div style={{ padding: "20px 0px 0px 0px" }}>
                        <div style={{ paddingBottom: "20px" }}>
                            <IonItem
                                lines="none"
                                className={`form ${
                                    "language_id" in errors
                                        ? "ion-invalid"
                                        : "ion-valid"
                                }`}
                            >
                                <IonSelect
                                    {...register("language_id")}
                                    placeholder="Choose Language"
                                    onIonChange={(e) => e.target.value}
                                    value={watch("language_id")}
                                >
                                    {iso6393Options.map((option) => (
                                        <IonSelectOption
                                            key={option}
                                            value={Object.keys(
                                                iso_639_3_enum
                                            ).find(
                                                (key: string) =>
                                                    iso_639_3_enum[key] ===
                                                    option
                                            )}
                                        >
                                            {option}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                                <IonNote slot="error">
                                    {errors.language_id?.message}
                                </IonNote>
                            </IonItem>
                        </div>

                        <div>
                            <Controller
                                control={control}
                                name="site_text_translation"
                                render={({ field: { onChange, value } }) => (
                                    <IonItem
                                        lines="none"
                                        className={`form ${
                                            "site_text_translation" in errors
                                                ? "ion-invalid"
                                                : "ion-valid"
                                        }`}
                                    >
                                        <IonInput
                                            placeholder="New Translation"
                                            onIonChange={onChange}
                                            value={value}
                                        />
                                        <IonNote slot="error">
                                            {
                                                errors.site_text_translation
                                                    ?.message
                                            }
                                        </IonNote>
                                    </IonItem>
                                )}
                            />
                        </div>

                        <div style={{ paddingTop: "10px" }}>
                            <Controller
                                control={control}
                                name="description_translation"
                                render={({ field: { onChange, value } }) => (
                                    <IonItem
                                        lines="none"
                                        className={`form ${
                                            "description_translation" in errors
                                                ? "ion-invalid"
                                                : "ion-valid"
                                        }`}
                                    >
                                        <IonTextarea
                                            autoGrow
                                            rows={5}
                                            placeholder="New Translation of Description"
                                            onIonChange={onChange}
                                            value={value}
                                        />
                                        <IonNote slot="error">
                                            {
                                                errors.description_translation
                                                    ?.message
                                            }
                                        </IonNote>
                                    </IonItem>
                                )}
                            />
                        </div>

                        <div className="button-container">
                            <Button
                                label="Cancel"
                                color="light"
                                onClick={() =>
                                    history.push(
                                        `/translation-app/site_texts?site_text_id=${params.site_text_id}`
                                    )
                                }
                            />
                            <Button label="Add New +" type="submit" />
                        </div>
                    </div>
                </form>
            </div>
        </IonContent>
    );
};

export default CreateSiteTextTranslation;
