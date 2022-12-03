import { useMutation } from "@apollo/client";
import {
    IonContent,
    IonSelect,
    IonSelectOption,
    useIonToast,
} from "@ionic/react";
import { useKeycloak } from "@react-keycloak/web";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router";
import Button from "../common/Button";
import { iso_639_3_enum } from "../common/iso_639_3_enum";
import { createLanguageProficiencyMutation, languageProficienciesQuery } from "../common/queries";
import Title from "../common/Title";
import { skillLevelEnum } from "./LanguageProficiencyv2";

const CreateLanguageProficiency = () => {
    const history = useHistory();
    const [present] = useIonToast();
    const { keycloak } = useKeycloak();

    const { control, handleSubmit } = useForm();
    const [skillLevel, setSkillLevel] = useState("");
    const [userId, setUserId] = useState<string>("");
    const [languageId, setLanguageId] = useState<string | undefined>(undefined);

    const [createLanguageProficiency] = useMutation(
        createLanguageProficiencyMutation
    );

    const iso_639_3_options = useMemo(() => Object.values(iso_639_3_enum), []);

    useEffect(() => {
        loadUserInfo();
        async function loadUserInfo() {
            const res = await keycloak.loadUserInfo();
            //@ts-expect-error
            setUserId(res.preferred_username);
            // setUserId(res.sub)
        }
    }, [keycloak]);

    const handleFormSubmit = () => {
        createLanguageProficiency({
            variables: {
                input: {
                    language_id: languageId,
                    language_table: "iso_639_3",
                    skill_level: skillLevel.replace(" ", ""),
                    user_id: userId,
                },
            },
            update: (cache, result) => {
              const cached = cache.readQuery({
                  query: languageProficienciesQuery,
                  returnPartialData: true,
              });
              cache.writeQuery({
                  query: languageProficienciesQuery,
                  data: {
                      //@ts-expect-error
                      ...cached,
                      languageProficiencies: [
                          //@ts-expect-error
                          ...cached.languageProficiencies,
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
          },
            onError: (e) => {
                present({
                    message: e.message,
                    duration: 1500,
                    color: "danger",
                });
            },
        });

        setSkillLevel("");
        setLanguageId(undefined);
    };

    return (
        <IonContent>
            <div style={{ padding: "60px 20px 60px 20px" }}>
                <Title title="Add Language Proficiency" />
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div style={{ paddingTop: "20px" }}>
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
                                    {iso_639_3_options.map((option) => (
                                        <IonSelectOption>
                                            {option}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                            )}
                        />
                    </div>

                    <div style={{ paddingTop: "10px" }}>
                        <Controller
                            control={control}
                            name="Proficiency Level"
                            render={() => (
                                <IonSelect
                                    placeholder="Proficiency Level"
                                    style={{
                                        border: "1px solid gray",
                                        borderRadius: "10px",
                                    }}
                                    onIonChange={(e) => {
                                        setSkillLevel(e.detail.value);
                                    }}
                                    value={skillLevel}
                                >
                                    {Object.entries(skillLevelEnum).map(
                                        ([skill, value]) => (
                                            <IonSelectOption
                                                value={skill}
                                                key={value}
                                            >
                                                {skill}
                                            </IonSelectOption>
                                        )
                                    )}
                                </IonSelect>
                            )}
                        />
                        <div
                            style={{
                                paddingTop: "10px",
                                display: "flex",
                                width: "90%",
                                justifyContent: "space-evenly",
                            }}
                        >
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
                    </div>
                </form>
            </div>
        </IonContent>
    );
};

export default CreateLanguageProficiency;
