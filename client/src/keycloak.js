import Keycloak from "keycloak-js";

// Where our Keycloak server is, and which realm and client to use
const keycloak = new Keycloak({
    url: "http://localhost:8180",
    realm: "petcare",
    clientId: "petcare-client",
});

export default keycloak;