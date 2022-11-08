import {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonList,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    useIonToast,
} from "@ionic/react";
import { Controller, useForm } from "react-hook-form";
import {
    appItemsQuery,
    siteTextsQuery,
    createSiteTextMutation,
} from "../common/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useMemo, useState } from "react";
import { IAppItem } from "./AppList";
import { useHistory } from "react-router-dom";

export interface ISiteText {
    id: number;
    app: number;
    site_text_key: string;
    description: string;
    language_id: number;
    language_table: string;
}

const SiteText: React.FC = () => {
    const [present] = useIonToast();
    const { control, handleSubmit } = useForm();
    const [app, setApp] = useState<IAppItem | undefined>(undefined);
    const [siteText, setSiteText] = useState<string>("");
    const [siteTextDescription, setSiteTextDescription] = useState<string>("");
    const appItemsRequest = useQuery(appItemsQuery);
    const { data } = useQuery(siteTextsQuery);
    const [createSiteText] = useMutation(createSiteTextMutation);

    const appData: { appItems: IAppItem[] } = useMemo(
        () => appItemsRequest.data,
        [appItemsRequest.data]
    );

    const siteTextData: { siteTexts: ISiteText[] } = useMemo(
        () => data,
        [data]
    );

    const history = useHistory();

    const handleSubmitForm = () => {
        createSiteText({
            variables: {
                input: {
                    app: app?.id,
                    description: siteTextDescription,
                    site_text_key: siteText,
                    language_id: 1,
                    language_table: "iso_639_3",
                },
            },
            update: (cache, result) => {
                const cached = cache.readQuery({
                    query: siteTextsQuery,
                    returnPartialData: true,
                });
                cache.writeQuery({
                    query: siteTextsQuery,
                    data: {
                        //@ts-expect-error
                        ...cached,
                        siteTexts: [
                            //@ts-expect-error
                            ...cached.siteTexts,
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
        setApp(undefined);
        setSiteText("");
        setSiteTextDescription("");
    };

    return (
        <IonContent>
            <div style={{ padding: "60px 20px 60px 20px" }}>
                <h3 style={{ color: "cornflowerblue" }}>Site Text</h3>
                <div>
                    <form onSubmit={handleSubmit(handleSubmitForm)}>
                        <Controller
                            control={control}
                            name="appName"
                            render={() => (
                                <IonSelect
                                    placeholder="Choose App"
                                    style={{ border: "1px solid gray" }}
                                    onIonChange={(e) => {
                                        setApp(e.detail.value);
                                    }}
                                    value={app}
                                >
                                    {appData &&
                                        appData.appItems.map(
                                            (item: IAppItem) => (
                                                <IonSelectOption
                                                    key={item.id}
                                                    value={item}
                                                >
                                                    {item.app_name}
                                                </IonSelectOption>
                                            )
                                        )}
                                </IonSelect>
                            )}
                        />

                        <div className="ion-center" style={{ paddingTop: 10 }}>
                            <Controller
                                control={control}
                                name="siteText"
                                render={() => (
                                    <IonInput
                                        placeholder="New Site Text"
                                        disabled={!app}
                                        style={{ border: "1px solid gray" }}
                                        onIonChange={(e) => {
                                            //@ts-expect-error
                                            setSiteText(e.target.value);
                                        }}
                                        value={siteText}
                                    />
                                )}
                            />
                        </div>

                        <Controller
                            control={control}
                            name="siteText"
                            render={() => (
                                <IonTextarea
                                    disabled={!siteText}
                                    placeholder="Description"
                                    style={{ border: "1px solid gray" }}
                                    onIonChange={(e) => {
                                        setSiteTextDescription(
                                            //@ts-expect-error
                                            e.target.value
                                        );
                                    }}
                                    value={siteTextDescription}
                                />
                            )}
                        />

                        <IonButton
                            fill="outline"
                            type="submit"
                            disabled={!app || !siteText || !siteTextDescription}
                        >
                            Submit
                        </IonButton>
                    </form>
                    <IonList lines="none">
                        {siteTextData &&
                            siteTextData.siteTexts.map((item: ISiteText) => (
                                <IonItem
                                    key={item.id}
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        history.push({
                                            pathname: `/translation-app/site-text-translation`,
                                            search: `?app_id=${item.app}&site_text_id=${item.id}`,
                                        })
                                    }
                                >
                                    {item.site_text_key} - {item.description}
                                </IonItem>
                            ))}
                    </IonList>
                </div>
            </div>
        </IonContent>
    );
};

export default SiteText;
