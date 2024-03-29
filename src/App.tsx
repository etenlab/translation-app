import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useKeycloak } from "@react-keycloak/web";
import Home from "./pages/Home";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./styles.css";
import Login from "./pages/Login";
setupIonicReact();

const App = () => {
    const { keycloak } = useKeycloak();
    const isAuthed = keycloak?.authenticated;

    return (
        <IonApp>
            <IonReactRouter>
                <IonRouterOutlet>
                    <Route
                        exact
                        path="/translation-app*"
                        render={() => {
                            return isAuthed ? <Home /> : <Login />;
                        }}
                    />
                    <Route path="/login" render={() => <Login />} />
                    <Route exact path="/">
                        <Redirect to="/translation-app" />
                    </Route>
                    <Route>
                        <Redirect to="/translation-app" />
                    </Route>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
