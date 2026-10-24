import { heroImages } from "../images";

export default function Hero({ title, subtitle, children }) {
    return (
        <section className="hero">
            <div className="hero-text">
                <span className="hero-badge">🐾 Happy pets, happy owners</span>
                <h1>{title}</h1>
                <p>{subtitle}</p>
                <div className="hero-actions">{children}</div>
            </div>

            <div className="hero-photos">
                <img className="photo photo-main" src={heroImages.golden} alt="Golden retriever puppy" />
                <img className="photo photo-side" src={heroImages.cavalier} alt="Cavalier puppy" />
                <img className="photo photo-small" src={heroImages.cat} alt="Orange cat" />
            </div>
        </section>
    );
}