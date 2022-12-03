import { IonContent, IonItem, IonList, IonText } from "@ionic/react";
import { appItemsQuery } from "../common/queries";
import { useQuery } from "@apollo/client";
import { useMemo } from "react";
import Title from "../common/Title";
import { useHistory } from "react-router";
import Button from "../common/Button";

export interface IAppItem {
    id: number;
    app_name: string;
}

const AppList = () => {
    const history = useHistory();
    const { data } = useQuery(appItemsQuery);
    const appData = useMemo(() => data, [data]);

    return (
        <IonContent>
            <div style={{ padding: "60px 20px 60px 20px", marginTop: "20px" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Title title="Applications" />
                    <Button
                        label="Add New +"
                        link="/translation-app/create-app"
                    />
                </div>
                <div style={{ marginTop: "30px" }}>
                    <IonText className="font-subtitle">
                        List of Applications
                    </IonText>
                    <IonList style={{ marginLeft: "-16px" }}>
                        {appData &&
                            appData.appItems.map((item: IAppItem) => (
                                <IonItem
                                    key={item.id}
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        history.push({
                                            pathname: `/translation-app/apps`,
                                            search: `app_id=${item.id}`,
                                        })
                                    }
                                >
                                    {item.app_name}
                                </IonItem>
                            ))}
                    </IonList>
                </div>
            </div>
        </IonContent>
    );
};

export default AppList;
