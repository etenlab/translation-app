import { IonContent, IonInput, IonTextarea, useIonToast } from "@ionic/react";
import { useHistory, useLocation } from "react-router";
import Button from "../common/Button";
import Title from "../common/Title";
import queryString from "query-string";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { siteTextQuery, updateSiteTextMutation } from "../common/queries";

const EditSiteText = () => {
    const { control, handleSubmit } = useForm();
    const [present] = useIonToast();
    const history = useHistory();
    const { search } = useLocation();
    const params = queryString.parse(search);

    const [siteText, setSiteText] = useState<string>("");
    const [siteTextDescription, setSiteTextDescription] = useState<string>("");

    const [updateSiteText] = useMutation(updateSiteTextMutation);

    const { data } = useQuery(siteTextQuery, {
        skip: +params.site_text_id! === undefined,
        variables: {
            siteTextId: +params.site_text_id!,
        },
    });

    useEffect(() => {
        if (data) {
            setSiteText(data?.siteText.site_text_key);
            setSiteTextDescription(data?.siteText.description);
        }
    }, [data]);

    const handleSubmitForm = () => {
        updateSiteText({
            variables: {
                input: {
                    description: siteTextDescription,
                    site_text_key: siteText,
                    site_text_id: +params.site_text_id!,
                },
            },
            onCompleted: () => {
                present({
                    message: "Site text updated successfully",
                    duration: 1500,
                    color: "success",
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
    };

    return (
        <IonContent>
            <div style={{ padding: "60px 20px 60px 20px" }}>
                <Title title="Edit Site Text" />
                <form onSubmit={handleSubmit(handleSubmitForm)}>
                    <div>
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
                        <div>
                            <Controller
                                control={control}
                                name="siteTextDescription"
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
                            justifyContent: "space-evenly",
                        }}
                    >
                        <Button
                            label="Cancel"
                            color="light"
                            onClick={() =>
                                history.push(
                                    `/translation-app/site_texts?site_text_id=${+data
                                        ?.siteText.id!}`
                                )
                            }
                        />
                        <Button label="Save" type="submit" />
                    </div>
                </form>
            </div>
        </IonContent>
    );
};

export default EditSiteText;
