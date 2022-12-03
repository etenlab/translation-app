import { IonContent, IonIcon, IonText } from "@ionic/react";
import { useHistory, useLocation } from "react-router";
import queryString from "query-string";
import { useLazyQuery } from "@apollo/client";
import Title from "../common/Title";
import { useEffect } from "react";
import { siteTextQuery } from "../common/queries";
import { arrowBack } from "ionicons/icons";
import Button from "../common/Button";

const SiteTextv2 = () => {
    const { search } = useLocation();
    const history = useHistory();

    const params = queryString.parse(search);

    const [getSiteText, { data }] = useLazyQuery(siteTextQuery);

    useEffect(() => {
        if (params.site_text_id! != null) {
            getSiteText({
                variables: {
                    siteTextId: +params.site_text_id,
                },
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                            history.push(
                                `/translation-app/apps?app_id=${data?.siteText.app}`
                            )
                        }
                    />
                    <Title title={data?.siteText.site_text_key} />
                </div>
                <IonText className="font-description">
                    {data?.siteText.description}
                </IonText>
                <div
                    style={{
                        paddingTop: "10px",
                        display: "flex",
                        justifyContent: "space-evenly",
                    }}
                >
                    <Button
                        label="Edit Site Text"
                        color="light"
                        onClick={() =>
                            history.push({
                                pathname: "/translation-app/edit-site-text",
                                search: `site_text_id=${data?.siteText.id}`,
                            })
                        }
                    />
                    <Button
                        label="Add New Translation +"
                        onClick={() =>
                            history.push({
                                pathname:
                                    "/translation-app/create-site-text-translation",
                                search: `site_text_id=${data?.siteText.id}`,
                            })
                        }
                    />
                </div>
            </div>
        </IonContent>
    );
};

export default SiteTextv2;
