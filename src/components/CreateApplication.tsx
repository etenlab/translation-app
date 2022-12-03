import { useMutation } from "@apollo/client";
import { IonContent, IonInput, useIonToast } from "@ionic/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router";
import Button from "../common/Button";
import { createAppItemMutation } from "../common/queries";
import Title from "../common/Title";

const CreateApplication = () => {
    const { control, handleSubmit } = useForm();
    const [present] = useIonToast();
    const history = useHistory();

    const [appName, setAppName] = useState<string | undefined>(undefined);

    const handleSubmitForm = () => {
        createAppItem({
            variables: { input: { app_name: appName } },
            onError: (e) => {
                present({
                    message: e.message,
                    duration: 1500,
                    color: "danger",
                });
            },
        });
        setAppName(undefined);
    };

    const [createAppItem] = useMutation(createAppItemMutation);

    return (
        <IonContent>
            <div style={{ padding: "60px 20px 20px 20px" }}>
                <Title title="Add New Application" />
            </div>
            <div style={{ padding: "0px 0px 0px 20px" }}>
                <form onSubmit={handleSubmit(handleSubmitForm)}>
                    <div style={{ width: "90%" }}>
                        <Controller
                            control={control}
                            name="appName"
                            render={() => (
                                <IonInput
                                    className="custom"
                                    placeholder="New Application Name"
                                    style={{
                                        border: "1px solid gray",
                                        borderRadius: "10px",
                                    }}
                                    onIonChange={(e) => {
                                        setAppName(
                                            e.target.value as unknown as string
                                        );
                                    }}
                                    value={appName}
                                />
                            )}
                        />
                    </div>
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
                                history.push("/translation-app/app-list")
                            }
                        />
                        <Button label="Add New +" type="submit" />
                    </div>
                </form>
            </div>
        </IonContent>
    );
};

export default CreateApplication;
