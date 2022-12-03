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
import { useMemo } from "react";
import { useHistory } from "react-router";
import Button from "../common/Button";
import { iso_639_3_enum } from "../common/iso_639_3_enum";
import { languageProficienciesQuery } from "../common/queries";
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

    const { data } = useQuery(languageProficienciesQuery);

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
                        icon={arrowBack}
                        style={{
                            fontSize: "18px",
                            padding: "9px 10px 0px 0px",
                            cursor: "pointer",
                        }}
                        onClick={() => history.push(`/translation-app/`)}
                    />
                    <Title title="Language Proficiency" />
                </div>
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
                                                    <IonText className="font-description">
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
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    <IonText
                                                        className="font-description"
                                                        style={{ opacity: 0.5 }}
                                                    >
                                                        {item.ref_name}
                                                    </IonText>
                                                </IonCol>
                                                <IonCol
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    <IonText className="font-description">
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
