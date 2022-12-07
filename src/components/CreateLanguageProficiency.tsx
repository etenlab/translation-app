import { useMutation } from "@apollo/client";
import {
    IonContent,
    IonItem,
    IonNote,
    IonSelect,
    IonSelectOption,
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
        watch,
    } = useForm<ILanguageProficiencyForm>({
        resolver: yupResolver(schema),
    });

    const history = useHistory();
    const [present] = useIonToast();
    const { keycloak } = useKeycloak();

    const [userId, setUserId] = useState<string>("");

    const [createLanguageProficiency] = useMutation(
        createLanguageProficiencyMutation
    );

    //this is a temporal fix to avoid render all possible options
    const iso_639_3_options = useMemo(
        () => Object.values(iso_639_3_enum).slice(0, 100),
        []
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
                            ...cached.languageProfienciesByUserId ?? [],
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
            <div style={{ padding: "60px 20px 60px 20px" }}>
                <Title title="Add Language Proficiency" />
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div style={{ paddingTop: "20px" }}>
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
                                {iso_639_3_options.map((option) => (
                                    <IonSelectOption
                                        key={option}
                                        value={Object.keys(iso_639_3_enum).find(
                                            (key: string) =>
                                                iso_639_3_enum[key] === option
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

                    <div style={{ paddingTop: "10px" }}>
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
                                onIonChange={(e) => {
                                    console.log(
                                        e.target.value.replace(" ", "")
                                    );
                                    return e.target.value.replace(" ", "");
                                }}
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
                    </div>
                </form>
            </div>
        </IonContent>
    );
};

export default CreateLanguageProficiency;
