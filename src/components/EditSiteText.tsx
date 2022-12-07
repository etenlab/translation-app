import {
    IonContent,
    IonInput,
    IonItem,
    IonNote,
    IonTextarea,
    useIonToast,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router";
import Button from "../common/Button";
import Title from "../common/Title";
import queryString from "query-string";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { siteTextQuery, updateSiteTextMutation } from "../common/queries";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import { ISiteTextForm } from "./CreateSiteText";

const schema = object().shape({
    site_text_key: string().min(5).max(256).required(),
    description: string().min(5).max(256).required(),
});

const EditSiteText = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ISiteTextForm>({
        resolver: yupResolver(schema),
    });

    const [present] = useIonToast();
    const history = useHistory();
    const { search } = useLocation();
    const params = queryString.parse(search);

    const [updateSiteText] = useMutation(updateSiteTextMutation);

    const { data } = useQuery(siteTextQuery, {
        skip: +params.site_text_id! === undefined,
        variables: {
            siteTextId: +params.site_text_id!,
        },
    });

    useEffect(() => {
        if (data) {
            setValue("site_text_key", data?.siteText.site_text_key);
            setValue("description", data?.siteText.description);
        }
    }, [data, setValue]);

    const handleSubmitForm = (siteTextForm: ISiteTextForm) => {
        updateSiteText({
            variables: {
                input: {
                    ...siteTextForm,
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

                    <div style={{ padding: "20px 0px 0px 0px" }}>
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
                    <div className="button-container"> 
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
