import KeyCloak from "keycloak-js";

const keycloak = new KeyCloak({
    url: "http://localhost:8080",
    realm: "showcase",
    clientId: "showcase-auth",
});

export default keycloak;
