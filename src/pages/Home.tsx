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
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router";
import AppList from "../components/AppList";
import LanguageProficiency from "../components/LanguageProficiency";
import SiteText from "../components/SiteText";
import SiteTextTranslation from "../components/SiteTextTranslation";
import "./Home.css";

const Home: React.FC = () => {
    return (
        <IonPage>
            <IonReactRouter>
                <IonMenu contentId="showcase-content">
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Showcase</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent fullscreen>
                        <IonList>
                            <IonItem href="/showcase/app-list">
                                <IonLabel>App List</IonLabel>
                            </IonItem>
                            <IonItem href="/showcase/site-text">
                                <IonLabel>Site Text</IonLabel>
                            </IonItem>
                            <IonItem href="/showcase/site-text-translation">
                                <IonLabel>Site Text Translation</IonLabel>
                            </IonItem>
                            <IonItem href="/showcase/language-proficiency">
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
                        <IonTitle>Showcase</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen id="showcase-content" scrollY={true}>
                    <IonRouterOutlet>
                        <Route
                            path="/showcase/app-list"
                            render={() => <AppList />}
                        />
                        <Route
                            path="/showcase/site-text"
                            render={() => <SiteText />}
                        />
                        <Route
                            path="/showcase/site-text-translation/:app_id?/:site_text_id?"
                            render={() => <SiteTextTranslation />}
                        />
                        <Route
                            path="/showcase/language-proficiency"
                            render={() => <LanguageProficiency />}
                        />
                    </IonRouterOutlet>
                </IonContent>
            </IonReactRouter>
        </IonPage>
    );
};

export default Home;
