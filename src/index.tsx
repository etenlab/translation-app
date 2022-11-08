import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import {
    ApolloClient,
    createHttpLink,
    InMemoryCache,
    ApolloProvider,
    ApolloLink,
} from "@apollo/client";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";
import { MultiAPILink } from "@habx/apollo-multi-endpoint-link";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([
        new MultiAPILink({
            endpoints: {
                site_text: "http://localhost:3001",
                voting: "http://localhost:3002",
            },
            createHttpLink: () => createHttpLink(),
        }),
    ]),
});

const eventLogger = (event: unknown, error: unknown) => {
    console.log("onKeycloakEvent", event, error);
};

const tokenLogger = (tokens: unknown) => {
    console.log("onKeycloakTokens", tokens);
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
    <ReactKeycloakProvider
        initOptions={{
            onLoad: "check-sso",
            checkLoginIframe: false,
            // flow: "implicit",
            // useNonce: true,
        }}
        // this is to prevent Login page rendering
        LoadingComponent={<></>}
        authClient={keycloak}
        onEvent={eventLogger}
        onTokens={tokenLogger}
    >
        <React.StrictMode>
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
        </React.StrictMode>
    </ReactKeycloakProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
