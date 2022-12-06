import {
    IonContent,
    IonIcon,
    IonInput,
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
    site_text_translation: string().min(5).max(20).required(),
});

export interface ILanguageProficiency {
    id: number;
    language_id: number;
    language_table: string;
    ref_name: string;
    skill_level: string;
    user_id: string;
}

const CreateSiteTextTranslation = () => {
    const { control, handleSubmit } = useForm();
    const { search } = useLocation();
    const { keycloak } = useKeycloak();
    const [present] = useIonToast();

    const history = useHistory();
    const params = queryString.parse(search);

    const [userId, setUserId] = useState<string>("");
    const [languageId, setLanguageId] = useState<string | undefined>(undefined);
    const [siteTextTranslation, setSiteTextTranslation] = useState<string>("");
    const [descriptionTranslation, setDescriptionTranslation] = useState<
        string | undefined
    >(undefined);
    const [iso6393Options, setIso6393Options] = useState<string[]>([]);

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

    const [createSiteTextTranslation] = useMutation(
        createSiteTextTranslationMutation
    );

    const { data } = useQuery(siteTextQuery, {
        skip: +params.site_text_id! === undefined,
        variables: {
            siteTextId: +params.site_text_id!,
        },
    });

    const handleSubmitForm = () => {
        createSiteTextTranslation({
            variables: {
                input: {
                    site_text: data?.siteText.id,
                    site_text_translation: siteTextTranslation,
                    language_id: languageId,
                    language_table: "iso_639_3",
                    user_id: userId,
                    description_translation: descriptionTranslation,
                },
            },
            onCompleted: () => {
                present({
                    message: "Site text translation created successfully",
                    duration: 1500,
                    color: "success",
                });
                setSiteTextTranslation("");
                setDescriptionTranslation(undefined);
                setLanguageId("");
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
                        icon={arrowBack}
                        style={{
                            fontSize: "18px",
                            padding: "9px 10px 0px 0px",
                            cursor: "pointer",
                        }}
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
                            <Controller
                                control={control}
                                name="ISO 693-3 Code"
                                render={() => (
                                    <IonSelect
                                        className="custom"
                                        placeholder="Choose Language"
                                        style={{
                                            border: "1px solid gray",
                                            borderRadius: "10px",
                                        }}
                                        onIonChange={(e) => {
                                            const languageId = Object.keys(
                                                iso_639_3_enum
                                            ).find(
                                                (key: string) =>
                                                    iso_639_3_enum[key] ===
                                                    e.target.value
                                            );
                                            setLanguageId(languageId!);
                                        }}
                                        value={iso_639_3_enum[languageId!]}
                                    >
                                        {iso6393Options.map((option) => (
                                            <IonSelectOption key={option}>
                                                {option}
                                            </IonSelectOption>
                                        ))}
                                    </IonSelect>
                                )}
                            />
                        </div>

                        <div>
                            <Controller
                                control={control}
                                name="siteTextTranslation"
                                render={() => (
                                    <IonInput
                                        className="custom"
                                        placeholder="New Translation"
                                        style={{
                                            border: "1px solid gray",
                                            borderRadius: "10px",
                                        }}
                                        onIonChange={(e) => {
                                            setSiteTextTranslation(
                                                e.target
                                                    .value as unknown as string
                                            );
                                        }}
                                        value={siteTextTranslation}
                                    />
                                )}
                            />
                        </div>

                        <div style={{ paddingTop: "20px" }}>
                            <Controller
                                control={control}
                                name="translation Description"
                                render={() => (
                                    <IonTextarea
                                        className="custom"
                                        rows={5}
                                        placeholder="New Translation of Description"
                                        style={{
                                            border: "1px solid gray",
                                            borderRadius: "10px",
                                        }}
                                        onIonChange={(e) => {
                                            setDescriptionTranslation(
                                                e.target
                                                    .value as unknown as string
                                            );
                                        }}
                                        value={descriptionTranslation}
                                    />
                                )}
                            />
                        </div>

                        <div
                            style={{
                                paddingTop: "10px",
                                display: "flex",
                                justifyContent: "space-evenly",
                            }}
                        >
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
