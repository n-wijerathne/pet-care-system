import { useState } from "react";
import keycloak from "./keycloak";
import Home from "./pages/Home";
import Pets from "./pages/Pets";
import CareServices from "./pages/CareServices";
import Appointments from "./pages/Appointments";

const tabs = [
    { id: "home", label: "Home" },
    { id: "pets", label: "Pets" },
    { id: "services", label: "Care Services" },
    { id: "appointments", label: "Appointments" },
];

export default function App() {
    const [page, setPage] = useState("home");

    const username = keycloak.tokenParsed?.preferred_username ?? "";

    function handleLogout() {
        // After logging out, come back to the cover page
        keycloak.logout({ redirectUri: window.location.origin });
    }

    return (
        <>
            <header className="app-header">
                <div className="app-header-inner">
                    <div className="brand">
                        🐾 <span>PetCare</span>
                    </div>

                    <nav className="tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={page === tab.id ? "active" : ""}
                                onClick={() => setPage(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    <div className="user-chip">
                        <div className="avatar">{username.charAt(0).toUpperCase()}</div>
                        <span>{username}</span>
                        <button className="light small" onClick={handleLogout}>
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            <main className="app-main">
                {page === "home" && <Home onNavigate={setPage} />}
                {page === "pets" && <Pets />}
                {page === "services" && <CareServices />}
                {page === "appointments" && <Appointments />}
            </main>
        </>
    );
}