import {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonList,
    IonSelect,
    IonSelectOption,
    useIonToast,
} from "@ionic/react";
import { Controller, useForm } from "react-hook-form";
import {
    appItemsQuery,
    createSiteTextTranslationMutation,
    siteTextsByAppIdQuery,
    siteTextTranslationsQuery,
} from "../common/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";
import { IAppItem } from "./AppList";
import { ISiteText } from "./SiteText";
import { useLocation } from "react-router";
import queryString from "query-string";
import { Autocomplete, TextField } from "@mui/material";
import { iso_639_3_enum } from "../common/iso_639_3_enum";

export interface ISiteTextTranslation {
    id: number;
    site_text: number;
    site_text_translation: number;
    user_id: string;
    language_id: number;
    language_table: string;
}

const SiteTextTranslation: React.FC = () => {
    const [present] = useIonToast();
    const { control, handleSubmit } = useForm();
    const [app, setApp] = useState<IAppItem | undefined>(undefined);
    const [siteText, setSiteText] = useState<ISiteText | undefined>(undefined);
    const [siteTextTranslation, setSiteTextTranslation] = useState<string>("");
    const [languageId, setLanguageId] = useState<string>("");

    const appItemsRequest = useQuery(appItemsQuery);

    const { search } = useLocation();

    const params = queryString.parse(search);

    const appData: { appItems: IAppItem[] } = useMemo(
        () => appItemsRequest.data,
        [appItemsRequest.data]
    );

    const siteTextRequest = useQuery(siteTextsByAppIdQuery, {
        skip: app?.id === undefined,
        variables: {
            siteTextsByAppIdId: app?.id ?? +params.app_id!,
        },
    });

    const siteTextData: { siteTextsByAppId: ISiteText[] } = useMemo(
        () => siteTextRequest.data,
        [siteTextRequest.data]
    );

    const { data } = useQuery(siteTextTranslationsQuery);

    const siteTextTranslationData: {
        siteTextTranslations: ISiteTextTranslation[];
    } = useMemo(() => data, [data]);

    const [createSiteTextTranslation] = useMutation(
        createSiteTextTranslationMutation
    );

    // Add languages filter (userId)

    useEffect(() => {
        if (params.app_id! && params.site_text_id!) {
            const appItem = appData?.appItems.filter(
                (appItem) => appItem.id === +params.app_id!
            )[0];

            const siteTextItem = siteTextData?.siteTextsByAppId.filter(
                (siteTextItem) => siteTextItem.id === +params.site_text_id!
            )[0];

            setApp(appItem);
            setSiteText(siteTextItem);
        }
    }, [appData?.appItems, params, siteTextData?.siteTextsByAppId]);

    const iso_639_3_options = useMemo(() => Object.keys(iso_639_3_enum), []);

    const handleChange = (iso: string) => {
        if (iso === null) setLanguageId("");
        let query = iso.toLowerCase();

        setLanguageId(
            iso_639_3_options.filter(
                (i) => i.toLowerCase().indexOf(query) > -1
            )[0]
        );
    };

    const handleSubmitForm = () => {
        createSiteTextTranslation({
            variables: {
                input: {
                    site_text: siteText?.id,
                    site_text_translation: siteTextTranslation,
                    language_id: languageId,
                    language_table: "iso_639_3",
                    user_id: "user_id",
                },
            },
            update: (cache, result) => {
                const cached = cache.readQuery({
                    query: siteTextTranslationsQuery,
                    returnPartialData: true,
                });
                cache.writeQuery({
                    query: siteTextTranslationsQuery,
                    data: {
                        //@ts-expect-error
                        ...cached,
                        siteTextTranslations: [
                            //@ts-expect-error
                            ...cached.siteTextTranslations,
                            result.data.createSiteTextTranslation,
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
            onCompleted: () => {
                setApp(undefined);
                setSiteText(undefined);
                setSiteTextTranslation("");
                setLanguageId("");
            },
        });

        setApp(undefined);
        setSiteText(undefined);
        setSiteTextTranslation("");
    };

    const isDisabled =
        !siteTextData ||
        (siteTextData && siteTextData.siteTextsByAppId.length < 1);

    return (
        <IonContent>
            <div style={{ padding: "60px 20px 60px 20px" }}>
                <h3 style={{ color: "cornflowerblue" }}>
                    Site Text Translation
                </h3>
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
                                        setSiteText(undefined);
                                    }}
                                    value={app}
                                >
                                    {appData &&
                                        appData.appItems.map(
                                            (item: IAppItem) => (
                                                <IonSelectOption
                                                    id={item.app_name}
                                                    value={item}
                                                >
                                                    {item.app_name}
                                                </IonSelectOption>
                                            )
                                        )}
                                </IonSelect>
                            )}
                        />

                        <div
                            className="ion-center"
                            style={{ paddingTop: 10, paddingBottom: 10 }}
                        >
                            <Controller
                                control={control}
                                name="siteText"
                                render={() => (
                                    <IonSelect
                                        placeholder={
                                            isDisabled
                                                ? "No site texts available"
                                                : "Choose Site Text"
                                        }
                                        style={{ border: "1px solid gray" }}
                                        onIonChange={(e) => {
                                            setSiteText(e.detail.value);
                                        }}
                                        disabled={isDisabled}
                                        value={siteText}
                                    >
                                        {siteTextData &&
                                            siteTextData.siteTextsByAppId.map(
                                                (item: ISiteText) => (
                                                    <IonSelectOption
                                                        key={item.id}
                                                        value={item}
                                                    >
                                                        {item.site_text_key}
                                                    </IonSelectOption>
                                                )
                                            )}
                                        {!siteTextData && (
                                            <IonItem>
                                                'No items to select'
                                            </IonItem>
                                        )}
                                    </IonSelect>
                                )}
                            />
                        </div>
                        <div style={{ paddingTop: 10, paddingBottom: 10 }}>
                            <p>{siteText?.description}</p>
                        </div>

                        <Controller
                            control={control}
                            name="ISO 693-3 Code"
                            render={() => (
                                <Autocomplete
                                    value={languageId}
                                    disablePortal
                                    id="ISO 693-3 Code"
                                    options={iso_639_3_options}
                                    sx={{
                                        py: 2,
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="ISO 693-3 Code"
                                        />
                                    )}
                                    onChange={(_, isoCode) =>
                                        handleChange(isoCode!)
                                    }
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="siteTextTranslation"
                            render={() => (
                                <IonInput
                                    disabled={!siteText}
                                    placeholder="New Translation"
                                    style={{ border: "1px solid gray" }}
                                    onIonChange={(e) => {
                                        setSiteTextTranslation(
                                            //@ts-expect-error
                                            e.target.value
                                        );
                                    }}
                                    value={siteTextTranslation}
                                />
                            )}
                        />

                        <IonButton
                            fill="outline"
                            type="submit"
                            disabled={
                                !app ||
                                !siteText ||
                                !siteTextTranslation ||
                                !languageId
                            }
                        >
                            Submit
                        </IonButton>
                    </form>
                    <IonList lines="none">
                        {siteTextTranslationData &&
                            siteTextTranslationData.siteTextTranslations.map(
                                (item: ISiteTextTranslation) => (
                                    <IonItem key={item.id}>
                                        {item.site_text_translation}
                                    </IonItem>
                                )
                            )}
                    </IonList>
                </div>
            </div>
        </IonContent>
    );
};

export default SiteTextTranslation;
