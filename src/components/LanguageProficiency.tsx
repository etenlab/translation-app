import { useMutation, useQuery } from "@apollo/client";
import {
    IonButton,
    IonCol,
    IonContent,
    IonGrid,
    IonItem,
    IonList,
    IonRow,
    IonSelect,
    IonSelectOption,
    useIonToast,
} from "@ionic/react";
import { Autocomplete, TextField } from "@mui/material";
import { useState, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { iso_639_3_enum } from "../common/iso_639_3_enum";
import {
    createLanguageProficiencyMutation,
    languageProficienciesQuery,
} from "../common/queries";

export interface ILanguageProficiency {
    id: number;
    user_id: string;
    language_table: string;
    language_id: number;
    skill_level: string;
    ref_name: string;
}

const LanguageProficiency = () => {
    const [present] = useIonToast();
    const [isoCode, setIsoCode] = useState("");
    const skillLevelOptions: Record<string, number> = useMemo(() => {
        return {
            "Started Learning": 1,
            "Recognize Words": 2,
            Proficient: 3,
            Conversational: 4,
            Fluent: 5,
        };
    }, []);

    const { data } = useQuery(languageProficienciesQuery);
    const [createLanguageProficiency] = useMutation(
        createLanguageProficiencyMutation
    );

    const iso_639_3_options = useMemo(() => Object.keys(iso_639_3_enum), []);

    const handleChange = (iso: string) => {
        let query = iso.toLowerCase();

        setIsoCode(
            iso_639_3_options.filter(
                (i) => i.toLowerCase().indexOf(query) > -1
            )[0]
        );
    };

    const handleFormSubmit = () => {
        createLanguageProficiency({
            variables: {
                input: {
                    language_id: isoCode,
                    language_table: "iso_639_3",
                    skill_level: skillLevel.replace(" ", ""),
                    user_id: "user id",
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
            onError: (e) => {
                present({
                    message: e.message,
                    duration: 1500,
                    color: "danger",
                });
            },
        });

        setSkillLevel("");
        setIsoCode("");
    };

    const [skillLevel, setSkillLevel] = useState("");

    const { control, handleSubmit } = useForm();
    return (
        <IonContent>
            <div style={{ padding: "60px 20px 60px 20px" }}>
                <IonList>
                    {data &&
                        data.languageProficiencies.map(
                            (item: ILanguageProficiency) => {
                                const itemKey = item.skill_level
                                    .split(/(?=[A-Z])/)
                                    .join(" ");
                                return (
                                    <IonItem>
                                        <IonGrid>
                                            <IonRow>
                                                <IonCol>
                                                    {iso_639_3_options.find(
                                                        (key) =>
                                                            iso_639_3_enum[
                                                                key
                                                            ] === item.ref_name
                                                    )}
                                                </IonCol>
                                                <IonCol
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {item.ref_name}
                                                </IonCol>
                                                <IonCol
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {" "}
                                                    {
                                                        skillLevelOptions[
                                                            itemKey
                                                        ]
                                                    }{" "}
                                                    - {itemKey}
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    </IonItem>
                                );
                            }
                        )}
                </IonList>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <Controller
                        control={control}
                        name="ISO 693-3 Code"
                        render={() => (
                            <Autocomplete
                                disablePortal
                                value={isoCode}
                                id="ISO 693-3 Code"
                                options={iso_639_3_options}
                                sx={{
                                    py: 2,
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="ISO 693-3 Code"
                                    />
                                )}
                                onChange={(_, isoCode) =>
                                    handleChange(isoCode!)
                                }
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="Proficiency Level"
                        render={() => (
                            <IonSelect
                                placeholder="Proficiency Level"
                                style={{ border: "1px solid gray" }}
                                onIonChange={(e) => {
                                    setSkillLevel(e.detail.value);
                                }}
                                value={skillLevel}
                            >
                                {Object.entries(skillLevelOptions).map(
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
                    <IonButton
                        style={{ paddingTop: 10 }}
                        fill="outline"
                        type="submit"
                        disabled={!isoCode || !skillLevel}
                    >
                        Submit
                    </IonButton>
                </form>
            </div>
        </IonContent>
    );
};

export default LanguageProficiency;
