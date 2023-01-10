import {
    IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonMenu,
    IonMenuButton,
    IonPage,
    IonRouterOutlet,
    IonTitle,
    IonToolbar,
    IonIcon,
} from "@ionic/react";
import { chatbubbleOutline, notificationsOutline } from "ionicons/icons";
import { IonReactRouter } from "@ionic/react-router";
import { useKeycloak } from "@react-keycloak/web";
import { useCallback } from "react";
import { Route } from "react-router-dom";
import Application from "../components/Application";
import AppList from "../components/AppList";
import CreateApplication from "../components/CreateApplication";
import CreateLanguageProficiency from "../components/CreateLanguageProficiency";
import CreateSiteText from "../components/CreateSiteText";
import CreateSiteTextTranslation from "../components/CreateSiteTextTranslation";
import EditSiteText from "../components/EditSiteText";
import LanguageProficiency from "../components/LanguageProficiency";
import LanguageProficiencyv2 from "../components/LanguageProficiencyv2";
import SiteText from "../components/SiteText";
import SiteTextTranslation from "../components/SiteTextTranslation";
import SiteTextv2 from "../components/SiteTextv2";
import Discussion from "../components/Discussion";
import DiscussionList from "../components/DiscussionList";
import "./Home.css";

const Home = () => {
    const { keycloak } = useKeycloak();

    const logout = useCallback(() => {
        keycloak?.logout();
    }, [keycloak]);

    return (
        <IonPage>
            <IonReactRouter>
                <IonMenu contentId="translation-app-content">
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Translation App</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent fullscreen>
                        <IonList>
                            <IonItem href="/translation-app/app-list">
                                <IonLabel>Applications</IonLabel>
                            </IonItem>
                            <IonItem href="/translation-app/language-proficiency/v2">
                                <IonLabel>Language Proficiency</IonLabel>
                            </IonItem>
                        </IonList>
                    </IonContent>
                </IonMenu>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>Translation App</IonTitle>
                        <IonButtons slot="primary">
                            {keycloak?.authenticated && (
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "30px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <a href="/translation-app/my-discussions">
                                        <IonIcon
                                            className="ion-ios7-chatbubble-outline"
                                            icon={chatbubbleOutline}
                                        />
                                    </a>
                                    <a href="/translation-app/notifications">
                                        <IonIcon
                                            className="ion-ios7-chatbubble-outline"
                                            icon={notificationsOutline}
                                        />
                                    </a>
                                    <button
                                        style={{
                                            fontSize: "16px",
                                            padding: "10px 5px",
                                            color: "#000",
                                            backgroundColor: "#fff",
                                            margin: "0px 2px",
                                        }}
                                        type="button"
                                        onClick={logout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </IonButtons>
                        <IonButtons></IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen id="translation-app-content" scrollY={true}>
                    <IonRouterOutlet>
                        <Route
                            path="/translation-app/apps/:app_id?"
                            exact
                            render={() => <Application />}
                        />

                        <Route
                            path="/translation-app/site_texts/:site_text_id?"
                            exact
                            render={() => <SiteTextv2 />}
                        />

                        <Route
                            path="/translation-app/app-list/"
                            render={() => <AppList />}
                        />

                        <Route
                            path="/translation-app/create-app"
                            render={() => <CreateApplication />}
                        />

                        <Route
                            path="/translation-app/create-site-text/:app_id?/:app_name?"
                            render={() => <CreateSiteText />}
                        />

                        <Route
                            path="/translation-app/edit-site-text/:site_text_id?"
                            render={() => <EditSiteText />}
                        />

                        <Route
                            path="/translation-app/site-text"
                            render={() => <SiteText />}
                        />

                        <Route
                            path="/translation-app/create-site-text-translation"
                            render={() => <CreateSiteTextTranslation />}
                        />

                        <Route
                            path="/translation-app/site-text-translation/:app_id?/:site_text_id?"
                            render={() => <SiteTextTranslation />}
                        />

                        <Route
                            path="/translation-app/language-proficiency"
                            exact
                            render={() => <LanguageProficiency />}
                        />

                        <Route
                            path="/translation-app/language-proficiency/v2"
                            exact
                            render={() => <LanguageProficiencyv2 />}
                        />

                        <Route
                            path="/translation-app/create-language-proficiency/"
                            exact
                            render={() => <CreateLanguageProficiency />}
                        />

                        <Route
                            path="/translation-app/discussion/:site_text/:site_text_translation_id/:app_id?/:site_text_id?"
                            exact
                            render={() => <Discussion />}
                        />

                        <Route
                            path="/translation-app/my-discussions"
                            exact
                            render={() => <DiscussionList />}
                        />
                    </IonRouterOutlet>
                </IonContent>
            </IonReactRouter>
        </IonPage>
    );
};

export default Home;
