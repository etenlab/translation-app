import {
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonList,
    IonModal,
    IonSearchbar,
    IonText,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router";
import queryString from "query-string";
import { useLazyQuery } from "@apollo/client";
import { appItemQuery, siteTextsByAppIdQuery } from "../common/queries";
import Title from "../common/Title";
import { arrowBack } from "ionicons/icons";
import { useEffect, useMemo, useState } from "react";
import Button from "../common/Button";
import { iso_639_3_enum } from "../common/iso_639_3_enum";
import { Virtuoso } from "react-virtuoso";

export interface ISiteText {
    id: number;
    app: number;
    site_text_key: string;
    description: string;
    language_id: number;
    language_table: string;
    translations: number;
}

const Application = () => {
    const { search } = useLocation();
    const history = useHistory();

    const params = search
        ? queryString.parse(search)
        : queryString.parseUrl(history.location.pathname).query;

    const [getApps, { data }] = useLazyQuery(appItemQuery);

    const [getSiteTexts, { data: siteTexts }] = useLazyQuery(
        siteTextsByAppIdQuery
    );

    const iso_639_3_options = useMemo(() => Object.values(iso_639_3_enum), []);

    const [results, setResults] = useState<ISiteText[]>(
        siteTexts?.siteTextsByApp
    );
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [languageId, setLanguageId] = useState<string | undefined>("");
    const [languageResults, setLanguageResults] = useState<string[]>([
        ...iso_639_3_options,
    ]);

    useEffect(() => {
        if (params.app_id!)
            getApps({
                variables: {
                    appItemId: +params.app_id!,
                },
            });

        getSiteTexts({
            variables: {
                siteTextsByAppId: +params.app_id!,
                isoCode: languageId?.length ? languageId : null,
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [languageId]);

    useEffect(() => {
        setResults(siteTexts?.siteTextsByApp);
    }, [siteTexts]);

    const handleChange = (e: Event) => {
        let query = "";
        const target = e.target as HTMLIonSearchbarElement;
        if (target) query = target.value!.toLowerCase();

        setResults(
            siteTexts?.siteTextsByApp.filter(
                (siteText: ISiteText) =>
                    siteText.site_text_key.toLowerCase().indexOf(query) > -1
            )
        );
    };

    const handleLanguageChange = (iso: string) => {
        let query = iso.toLowerCase();

        setLanguageResults(
            iso_639_3_options.filter((i) => i.toLowerCase().indexOf(query) > -1)
        );
    };

    return (
        <IonContent>
            <div style={{ padding: "60px 10px 60px 20px" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <IonIcon
                        className="back"
                        icon={arrowBack}
                        onClick={() =>
                            history.push("/translation-app/app-list/")
                        }
                    />
                    <Title title={data?.appItem.app_name} />
                </div>
                <IonModal
                    isOpen={isOpen}
                    onWillDismiss={() => setIsOpen(false)}
                >
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Choose Language</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <div style={{ height: "100%" }}>
                            <IonSearchbar
                                debounce={1000}
                                onIonChange={(e) => {
                                    setLanguageId(undefined);
                                    handleLanguageChange(e.target.value!);
                                }}
                            />
                            <Virtuoso
                                style={{ height: "84%" }}
                                data={languageResults}
                                itemContent={(_, item) => {
                                    const value = Object.keys(
                                        iso_639_3_enum
                                    ).find(
                                        (key: string) =>
                                            iso_639_3_enum[key] === item
                                    );
                                    return (
                                        <IonItem
                                            key={item}
                                            style={{
                                                opacity:
                                                    value === languageId
                                                        ? undefined
                                                        : 0.5,
                                            }}
                                            onClick={() => {
                                                setLanguageId(value);
                                            }}
                                        >
                                            {item}
                                        </IonItem>
                                    );
                                }}
                            />

                            <div className="button-container">
                                <Button
                                    label={
                                        languageId ? "Clear Filter" : "Cancel"
                                    }
                                    color="light"
                                    onClick={() => {
                                        if (languageId) {
                                            setLanguageId("")
                                            return
                                        }
                                        setIsOpen(false);
                                        setLanguageResults([
                                            ...iso_639_3_options,
                                        ]);
                                    }}
                                />
                                <Button
                                    label="Confirm"
                                    onClick={() => {
                                        if (languageId) {
                                            setIsOpen(false);
                                            setLanguageResults([
                                                ...iso_639_3_options,
                                            ]);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </IonContent>
                </IonModal>
                <div style={{ marginTop: "10px" }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <IonText className="font-subtitle">
                            List of Site Texts
                        </IonText>
                        <Button
                            label="Add New +"
                            onClick={() =>
                                history.push(
                                    `/translation-app/create-site-text?app=${params.app_id!}&app_name=${data
                                        ?.appItem.app_name!}`
                                )
                            }
                        />
                    </div>
                    <IonList style={{ marginLeft: "-12px", marginTop: "5px" }}>
                        <div>
                            <div
                                style={{
                                    paddingLeft: "10px",
                                    paddingBottom: "10px",
                                    width: "99%",
                                }}
                            >
                                <div>
                                    <IonButton
                                        expand="block"
                                        color="light"
                                        className="lang"
                                        onClick={() => setIsOpen(true)}
                                    >
                                        <span
                                            style={{ marginRight: "auto" }}
                                            className="font-language"
                                        >
                                            {languageId
                                                ? iso_639_3_enum[languageId]
                                                : "Choose Language"}
                                        </span>
                                    </IonButton>
                                </div>
                            </div>
                            <IonSearchbar
                                placeholder="Find Site Text"
                                debounce={1000}
                                onIonChange={(e) => handleChange(e)}
                            />
                        </div>
                        {results &&
                            results.map((item: ISiteText) => (
                                <IonItem
                                    key={item.id}
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        history.push({
                                            pathname: `/translation-app/site_texts`,
                                            search: `site_text_id=${item.id}`,
                                        })
                                    }
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            width: "100%",
                                        }}
                                    >
                                        <IonText>{item.site_text_key}</IonText>
                                        <IonText
                                            className="font-title"
                                            color={
                                                item.translations === 0
                                                    ? "danger"
                                                    : undefined
                                            }
                                        >
                                            {item.translations}
                                        </IonText>
                                    </div>
                                </IonItem>
                            ))}
                    </IonList>
                </div>
            </div>
        </IonContent>
    );
};

export default Application;
