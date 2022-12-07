import { useQuery } from "@apollo/client";
import {
    IonCol,
    IonContent,
    IonGrid,
    IonIcon,
    IonItem,
    IonList,
    IonRow,
    IonText,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import Button from "../common/Button";
import { iso_639_3_enum } from "../common/iso_639_3_enum";
import { languageProficienciesByUserIdQuery } from "../common/queries";
import { useKeycloak } from "@react-keycloak/web";
import Title from "../common/Title";

export interface ILanguageProficiency {
    id: number;
    user_id: string;
    language_table: string;
    language_id: number;
    skill_level: string;
    ref_name: string;
}

export const skillLevelEnum: Record<string, number> = {
    "Started Learning": 1,
    "Recognize Words": 2,
    Proficient: 3,
    Conversational: 4,
    Fluent: 5,
};

const LanguageProficiencyv2 = () => {
    const history = useHistory();
    const [userId, setUserId] = useState<string>("");
    const { keycloak } = useKeycloak();

    useEffect(() => {
        loadUserInfo();
        async function loadUserInfo() {
            const res = await keycloak.loadUserInfo();
            //@ts-expect-error
            setUserId(res.preferred_username);
            // setUserId(res.sub)
        }
    }, [keycloak]);

    const { data } = useQuery(languageProficienciesByUserIdQuery, {
        variables: {
            userId,
        },
    });

    const skillLevelOptions = useMemo(() => skillLevelEnum, []);
    const iso_639_3_options = useMemo(() => Object.keys(iso_639_3_enum), []);

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
                        onClick={() => history.push(`/translation-app/`)}
                    />
                    <Title title="Language Proficiency" />
                </div>
                <IonList>
                    {data &&
                        data.languageProfienciesByUserId.map(
                            (item: ILanguageProficiency) => {
                                const itemKey = item.skill_level
                                    .split(/(?=[A-Z])/)
                                    .join(" ");
                                return (
                                    <IonItem key={itemKey}>
                                        <IonGrid>
                                            <IonRow>
                                                <IonCol
                                                    size="5"
                                                    style={{
                                                        // whiteSpace: "nowrap",
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        overflow: "hidden",
                                                        textOverflow: "elipsis",
                                                    }}
                                                >
                                                    <IonText className="font-language">
                                                        {item.ref_name}
                                                    </IonText>
                                                </IonCol>
                                                <IonCol
                                                    size="3"
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <IonText
                                                        className="font-language"
                                                        style={{
                                                            opacity: 0.5,
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        {iso_639_3_options.find(
                                                            (key) =>
                                                                iso_639_3_enum[
                                                                    key
                                                                ] ===
                                                                item.ref_name
                                                        )}
                                                    </IonText>
                                                </IonCol>

                                                <IonCol
                                                    size="4"
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent: "end",
                                                    }}
                                                >
                                                    <IonText className="font-language">
                                                        {
                                                            skillLevelOptions[
                                                                itemKey
                                                            ]
                                                        }{" "}
                                                        - {itemKey}
                                                    </IonText>
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    </IonItem>
                                );
                            }
                        )}
                </IonList>
                <div
                    style={{
                        paddingTop: "20px",
                        display: "flex",
                    }}
                >
                    <Button
                        label="Add New +"
                        onClick={() =>
                            history.push(
                                `/translation-app/create-language-proficiency`
                            )
                        }
                    />
                </div>
            </div>
        </IonContent>
    );
};

export default LanguageProficiencyv2;
