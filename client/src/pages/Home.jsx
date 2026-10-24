import { useEffect, useState } from "react";
import keycloak from "../keycloak";
import { api } from "../api";
import Hero from "../components/Hero";

export default function Home({ onNavigate }) {
    const [stats, setStats] = useState({ pets: "–", services: "–", appointments: "–" });

    const name =
        keycloak.tokenParsed?.given_name || keycloak.tokenParsed?.preferred_username || "";

    useEffect(() => {
        async function loadStats() {
            try {
                // One call to each of the three services, through the gateway
                const [pets, services, appointments] = await Promise.all([
                    api.get("/pets"),
                    api.get("/care-services"),
                    api.get("/appointments"),
                ]);
                setStats({
                    pets: pets.length,
                    services: services.length,
                    appointments: appointments.length,
                });
            } catch {
                // keep the dashes if something is unavailable
            }
        }
        loadStats();
    }, []);

    return (
        <section>
            <div className="hero-card">
                <Hero
                    title={`Welcome back, ${name}!`}
                    subtitle="Keep your pets healthy and happy. Manage their profiles, browse care services and book appointments."
                >
                    <button className="light big" onClick={() => onNavigate("pets")}>
                        My pets
                    </button>
                    <button className="ghost-light big" onClick={() => onNavigate("appointments")}>
                        Book an appointment
                    </button>
                </Hero>
            </div>

            <div className="stats">
                <div className="stat">
                    <div className="stat-icon">🐶</div>
                    <div>
                        <div className="stat-number">{stats.pets}</div>
                        <div className="stat-label">Pets registered</div>
                    </div>
                </div>
                <div className="stat">
                    <div className="stat-icon">💉</div>
                    <div>
                        <div className="stat-number">{stats.services}</div>
                        <div className="stat-label">Care services</div>
                    </div>
                </div>
                <div className="stat">
                    <div className="stat-icon">📅</div>
                    <div>
                        <div className="stat-number">{stats.appointments}</div>
                        <div className="stat-label">Appointments</div>
                    </div>
                </div>
            </div>
        </section>
    );
}