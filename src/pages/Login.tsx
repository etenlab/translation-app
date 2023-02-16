import {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import { useKeycloak } from "@react-keycloak/web";
import { useCallback } from "react";
import "./Home.css";

const Login = () => {
    const { keycloak } = useKeycloak();
    const login = useCallback(() => {
        keycloak?.login();
    }, [keycloak]);

    const register = useCallback(() => {
        keycloak?.register();
    }, [keycloak]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Login</IonTitle>
                    <IonButtons slot="primary">
                        <div
                            style={{
                                marginRight: "20px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <button
                                type="button"
                                onClick={register}
                                style={{
                                    fontSize: "16px",
                                    padding: "10px 5px",
                                    color: "#000",
                                    backgroundColor: "#fff",
                                    margin: "0px 2px",
                                }}
                            >
                                Register
                            </button>
                            <button
                                type="button"
                                onClick={login}
                                style={{
                                    fontSize: "16px",
                                    padding: "10px 5px",
                                    color: "#000",
                                    backgroundColor: "#FFF",
                                    margin: "0px 2px",
                                }}
                            >
                                Login
                            </button>
                        </div>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen></IonContent>
        </IonPage>
    );
};

export default Login;
