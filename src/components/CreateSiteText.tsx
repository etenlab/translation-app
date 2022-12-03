import {
    IonContent,
    IonInput,
    IonText,
    IonTextarea,
    useIonToast,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router";
import queryString from "query-string";
import Title from "../common/Title";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import {
    createSiteTextMutation,
    siteTextsByAppIdQuery,
} from "../common/queries";
import Button from "../common/Button";

const CreateSiteText = () => {
    const [present] = useIonToast();
    const { search } = useLocation();
    const history = useHistory();

    const params = queryString.parse(search);
    const { control, handleSubmit } = useForm();
    const [siteText, setSiteText] = useState<string>("");
    const [siteTextDescription, setSiteTextDescription] = useState<string>("");

    const [createSiteText] = useMutation(createSiteTextMutation);

    const handleSubmitForm = () => {
        createSiteText({
            variables: {
                input: {
                    app: +params.app!,
                    description: siteTextDescription,
                    site_text_key: siteText,
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
                console.log(cached);
                cache.writeQuery({
                    query: siteTextsByAppIdQuery,
                    variables: { siteTextsByAppId: +params.app! },
                    data: {
                        //@ts-expect-error
                        ...cached,
                        siteTextsByApp: [
                            ////@ts-expect-error
                            // ...cached.siteTextsByApp,
                            result.data.createSiteText,
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

        setSiteText("");
        setSiteTextDescription("");
    };

    return (
        <IonContent>
            <div style={{ padding: "60px 20px 20px 20px" }}>
                <IonText className="font-subtitle">{params.app_name}</IonText>
                <Title title="Add New Site Text" />
            </div>
            <div style={{ padding: "0px 0px 0px 20px" }}>
                <form onSubmit={handleSubmit(handleSubmitForm)}>
                    <div style={{ width: "90%" }}>
                        <Controller
                            control={control}
                            name="siteText"
                            render={() => (
                                <IonInput
                                    className="custom"
                                    placeholder="New Site Text"
                                    style={{
                                        border: "1px solid gray",
                                        borderRadius: "10px",
                                    }}
                                    onIonChange={(e) => {
                                        setSiteText(
                                            e.target.value as unknown as string
                                        );
                                    }}
                                    value={siteText}
                                />
                            )}
                        />
                    </div>

                    <div style={{ padding: "20px 0px 0px 0px" }}>
                        <div style={{ width: "90%" }}>
                            <Controller
                                control={control}
                                name="siteText"
                                render={() => (
                                    <IonTextarea
                                        className="custom"
                                        rows={5}
                                        placeholder="Description"
                                        style={{
                                            border: "1px solid gray",
                                            borderRadius: "10px",
                                        }}
                                        onIonChange={(e) => {
                                            setSiteTextDescription(
                                                e.target
                                                    .value as unknown as string
                                            );
                                        }}
                                        value={siteTextDescription}
                                    />
                                )}
                            />
                        </div>
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
