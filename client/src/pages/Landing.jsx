import keycloak from "../keycloak";
import Hero from "../components/Hero";
import { heroImages } from "../images";
import { siteInfo } from "../siteInfo";

export default function Landing() {
    return (
        <div>
            <div className="landing-top">
                <nav className="landing-nav">
                    <div className="brand">
                        🐾 <span>{siteInfo.name}</span>
                    </div>

                    <div className="nav-links">
                        <a href="#about">About us</a>
                        <a href="#contact">Contact</a>
                    </div>

                    <div className="nav-actions">
                        <button className="ghost-light" onClick={() => keycloak.register()}>
                            Create account
                        </button>
                        <button className="light" onClick={() => keycloak.login()}>
                            Sign in
                        </button>
                    </div>
                </nav>

                <Hero
                    title="Love your pets. We'll take care of the rest."
                    subtitle="Keep every pet profile in one place, browse our care services and book vet or grooming appointments in a few clicks."
                >
                    <button className="light big" onClick={() => keycloak.login()}>
                        Get started
                    </button>
                    <button className="ghost-light big" onClick={() => keycloak.register()}>
                        Create account
                    </button>
                </Hero>
            </div>

            <section className="features">
                <div className="feature">
                    <div className="feature-icon">🐶</div>
                    <h3>Pet profiles</h3>
                    <p>Add your pets with their photos, breed and age, and update them any time.</p>
                </div>
                <div className="feature">
                    <div className="feature-icon">📅</div>
                    <h3>Easy booking</h3>
                    <p>Choose a care service, pick a date and book. Cancel with one click.</p>
                </div>
                <div className="feature">
                    <div className="feature-icon">🔒</div>
                    <h3>Safe and private</h3>
                    <p>Your account is protected with a secure login, and your data stays yours.</p>
                </div>
            </section>

            <section id="about" className="section about">
                <div className="about-photo">
                    <img src={heroImages.cavalier} alt="Cavalier puppy" />
                </div>
                <div className="about-text">
                    <span className="section-tag">About us</span>
                    <h2>Caring for pets like family</h2>
                    <p>{siteInfo.about}</p>
                    <ul className="about-list">
                        <li>💜 A friendly and experienced pet-care team</li>
                        <li>🩺 Vaccinations, grooming and check-ups in one place</li>
                        <li>📅 Simple online booking, and you can cancel any time</li>
                    </ul>
                </div>
            </section>

            <section id="contact" className="section contact">
                <div className="section-head">
                    <span className="section-tag">Contact</span>
                    <h2>Get in touch</h2>
                    <p>Questions about your pet or an appointment? We are happy to help.</p>
                </div>

                <div className="contact-grid">
                    <a className="contact-card" href={`tel:${siteInfo.phoneLink}`}>
                        <div className="contact-icon">📞</div>
                        <h3>Call us</h3>
                        <p>{siteInfo.phone}</p>
                    </a>

                    <a className="contact-card" href={`mailto:${siteInfo.email}`}>
                        <div className="contact-icon">✉️</div>
                        <h3>Email us</h3>
                        <p>{siteInfo.email}</p>
                    </a>

                    <div className="contact-card">
                        <div className="contact-icon">📍</div>
                        <h3>Visit us</h3>
                        <p>{siteInfo.address}</p>
                    </div>

                    <div className="contact-card">
                        <div className="contact-icon">🕒</div>
                        <h3>Opening hours</h3>
                        <p>{siteInfo.hours}</p>
                    </div>
                </div>
            </section>

            <footer className="footer">
                © {new Date().getFullYear()} {siteInfo.name}. Made with 💜 for pets.
            </footer>
        </div>
    );
}