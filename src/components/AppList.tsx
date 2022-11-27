import {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonList,
    useIonToast,
} from "@ionic/react";
import { Controller, useForm } from "react-hook-form";
import { appItemsQuery, createAppItemMutation } from "../common/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useMemo, useState } from "react";

export interface IAppItem {
    id: number;
    app_name: string;
}

const AppList = () => {
    const [present] = useIonToast();
    const { control, handleSubmit } = useForm();
    const [appName, setAppName] = useState<string>("");
    const { data } = useQuery(appItemsQuery);

    const appData = useMemo(() => data, [data]);
    const [createAppItem] = useMutation(createAppItemMutation);

    const handleSubmitForm = () => {
        createAppItem({
            variables: { input: { app_name: appName } },
            update: (cache, result) => {
                const cached = cache.readQuery({
                    query: appItemsQuery,
                    returnPartialData: true,
                });
                cache.writeQuery({
                    query: appItemsQuery,
                    data: {
                        //@ts-expect-error
                        ...cached,
                        appItems: [
                            //@ts-expect-error
                            ...cached.appItems,
                            result.data.createAppItem,
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
        setAppName("");
    };

    return (
        <IonContent>
            <div style={{ padding: "60px 20px 60px 20px" }}>
                <h3 style={{ color: "cornflowerblue" }}>App List</h3>
                <div>
                    <form onSubmit={handleSubmit(handleSubmitForm)}>
                        <div style={{ display: "flex" }}>
                            <Controller
                                control={control}
                                name="appName"
                                render={() => (
                                    <IonInput
                                        placeholder="New App Name"
                                        style={{ border: "1px solid gray" }}
                                        onIonChange={(e) => {
                                            //@ts-expect-error
                                            setAppName(e.target.value);
                                        }}
                                        value={appName}
                                    />
                                )}
                            />

                            <IonButton
                                fill="outline"
                                type="submit"
                                disabled={!appName}
                            >
                                Submit
                            </IonButton>
                        </div>
                    </form>
                    <IonList lines="none">
                        {appData &&
                            appData.appItems.map((item: IAppItem) => (
                                <IonItem key={item.id}>{item.app_name}</IonItem>
                            ))}
                    </IonList>
                </div>
            </div>
        </IonContent>
    );
};

export default AppList;
