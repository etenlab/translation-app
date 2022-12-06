import {
    IonContent,
    IonIcon,
    IonItem,
    IonList,
    IonSearchbar,
    IonText,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router";
import queryString from "query-string";
import { useLazyQuery } from "@apollo/client";
import { appItemQuery, siteTextsByAppIdQuery } from "../common/queries";
import Title from "../common/Title";
import { arrowBack } from "ionicons/icons";
import { useEffect, useState } from "react";
import Button from "../common/Button";

export interface ISiteText {
    id: number;
    app: number;
    site_text_key: string;
    description: string;
    language_id: number;
    language_table: string;
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

    const [results, setResults] = useState<ISiteText[]>(
        siteTexts?.siteTextsByApp
    );

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
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    return (
        <IonContent>
            <div style={{ padding: "60px 20px 60px 20px" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <IonIcon
                        icon={arrowBack}
                        style={{
                            fontSize: "18px",
                            padding: "9px 10px 0px 0px",
                            cursor: "pointer",
                        }}
                        onClick={() =>
                            history.push("/translation-app/app-list/")
                        }
                    />
                    <Title title={data?.appItem.app_name} />
                </div>
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
                        <IonSearchbar
                            placeholder="Find Site Text"
                            debounce={1000}
                            onIonChange={(e) => handleChange(e)}
                        />
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
                                    {item.site_text_key}
                                </IonItem>
                            ))}
                    </IonList>
                </div>
            </div>
        </IonContent>
    );
};

export default Application;
