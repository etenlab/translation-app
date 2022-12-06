import { useMutation } from "@apollo/client";
import {
    IonContent,
    IonInput,
    IonItem,
    IonNote,
    useIonToast,
} from "@ionic/react";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router";
import Button from "../common/Button";
import { createAppItemMutation } from "../common/queries";
import Title from "../common/Title";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

const schema = object().shape({
    app_name: string().min(5).max(128).required(),
});

export interface IAppForm {
    app_name: string;
}

const CreateApplication = () => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IAppForm>({
        resolver: yupResolver(schema),
    });
    const [present] = useIonToast();
    const history = useHistory();
    const [createAppItem] = useMutation(createAppItemMutation);

    const handleSubmitForm = (appForm: IAppForm) => {
        createAppItem({
            variables: { input: { app_name: appForm.app_name } },
            onCompleted: () => {
                present({
                    message: "App created successfully",
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
            <div style={{ padding: "60px 20px 20px 20px" }}>
                <Title title="Add New Application" />
            </div>
            <div style={{ padding: "0px 20px 0px 20px" }}>
                <form onSubmit={handleSubmit(handleSubmitForm)}>
                    <div>
                        <Controller
                            control={control}
                            name="app_name"
                            render={({ field: { onChange, value } }) => (
                                <IonItem
                                    lines="none"
                                    className={`form ${
                                        "app_name" in errors
                                            ? "ion-invalid"
                                            : "ion-valid"
                                    }`}
                                >
                                    <IonInput
                                        placeholder="New Application Name"
                                        onIonChange={onChange}
                                        value={value}
                                    />

                                    <IonNote slot="error">
                                        {errors.app_name?.message}
                                    </IonNote>
                                </IonItem>
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
