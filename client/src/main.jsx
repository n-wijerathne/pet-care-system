import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import keycloak from "./keycloak";
import App from "./App.jsx";
import Landing from "./pages/Landing.jsx";
import "./index.css";

// "check-sso" asks Keycloak: is this visitor already logged in?
//  yes -> show the app      no -> show the cover (landing) page
keycloak
    .init({
        onLoad: "check-sso",
        pkceMethod: "S256",
        checkLoginIframe: false,
    })
    .then((authenticated) => {
        createRoot(document.getElementById("root")).render(
            <StrictMode>{authenticated ? <App /> : <Landing />}</StrictMode>
        );
    })
    .catch((error) => {
        console.error("Keycloak init failed", error);
        document.getElementById("root").innerText =
            "Cannot reach the login server (Keycloak). Is it running on port 8180?";
    });