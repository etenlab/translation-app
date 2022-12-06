import {
    IonContent,
    IonInput,
    IonItem,
    IonNote,
    IonText,
    IonTextarea,
    useIonToast,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router";
import queryString from "query-string";
import Title from "../common/Title";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import {
    createSiteTextMutation,
    siteTextsByAppIdQuery,
} from "../common/queries";
import Button from "../common/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

const schema = object().shape({
    site_text_key: string().min(5).max(256).required(),
    description: string().min(5).max(256).required(),
});

export interface ISiteTextForm {
    site_text_key: string;
    description: string;
}

const CreateSiteText = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ISiteTextForm>({
        resolver: yupResolver(schema),
    });

    const [present] = useIonToast();
    const history = useHistory();
    const { search } = useLocation();
    const params = queryString.parse(search);

    const [createSiteText] = useMutation(createSiteTextMutation);

    const handleSubmitForm = (siteTextForm: ISiteTextForm) => {
        createSiteText({
            variables: {
                input: {
                    app: +params.app!,
                    description: siteTextForm.description,
                    site_text_key: siteTextForm.site_text_key,
                    language_id: 1,
                    language_table: "iso_639_3",
                },
            },
            update: (cache, result) => {
                const cached = cache.readQuery({
                    query: siteTextsByAppIdQuery,
                    optimistic: true,
                    variables: { siteTextsByAppId: +params.app! },
                    returnPartialData: true,
                });
                cache.writeQuery({
                    query: siteTextsByAppIdQuery,
                    variables: { siteTextsByAppId: +params.app! },
                    data: {
                        //@ts-expect-error
                        ...cached,
                        siteTextsByApp: [
                            //@ts-expect-error
                            ...cached.siteTextsByApp,
                            result.data.createSiteText,
                        ],
                    },
                });
            },

            onCompleted: () => {
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
                <IonText className="font-subtitle">{params.app_name}</IonText>
                <Title title="Add New Site Text" />
            </div>
            <div style={{ padding: "0px 20px 0px 20px" }}>
                <form onSubmit={handleSubmit(handleSubmitForm)}>
                    <div>
                        <Controller
                            control={control}
                            name="site_text_key"
                            render={({ field: { onChange, value } }) => (
                                <IonItem
                                    lines="none"
                                    className={`form ${
                                        "site_text_key" in errors
                                            ? "ion-invalid"
                                            : "ion-valid"
                                    }`}
                                >
                                    <IonInput
                                        placeholder="New Site Text"
                                        onIonChange={onChange}
                                        value={value}
                                    />
                                    <IonNote slot="error">
                                        {errors.site_text_key?.message}
                                    </IonNote>
                                </IonItem>
                            )}
                        />
                    </div>

                    <div style={{ padding: "10px 0px 0px 0px" }}>
                        <div>
                            <Controller
                                control={control}
                                name="description"
                                render={({ field: { onChange, value } }) => (
                                    <IonItem
                                        lines="none"
                                        className={`form ${
                                            "description" in errors
                                                ? "ion-invalid"
                                                : "ion-valid"
                                        }`}
                                    >
                                        <IonTextarea
                                            autoGrow
                                            rows={5}
                                            placeholder="Description"
                                            onIonChange={onChange}
                                            value={value}
                                        />
                                        <IonNote slot="error">
                                            {errors.description?.message}
                                        </IonNote>
                                    </IonItem>
                                )}
                            />
                        </div>
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
                                    `/translation-app/apps/?app_id=${+params.app!}`
                                )
                            }
                        />
                        <Button label="Add New +" type="submit" />
                    </div>
                </form>
            </div>
        </IonContent>
    );
};

export default CreateSiteText;
