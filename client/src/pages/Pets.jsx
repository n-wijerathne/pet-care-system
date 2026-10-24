import { useEffect, useRef, useState } from "react";
import { api } from "../api";
import Modal from "../components/Modal";
import { EditIcon, TrashIcon, PlusIcon, CameraIcon } from "../components/Icons";
import { resizeImage } from "../utils";

const emptyPet = { name: "", species: "Dog", breed: "", age: 0, ownerName: "", photo: null };

// A friendly emoji when a pet has no photo yet
const SPECIES = ["Cat", "Dog", "Fish", "Bird", "Small Mammals & Rodents"];

// A friendly emoji when a pet has no photo yet
function speciesEmoji(species) {
    const s = (species || "").toLowerCase();
    if (s.includes("dog")) return "🐶";
    if (s.includes("cat")) return "🐱";
    if (s.includes("fish")) return "🐟";
    if (s.includes("bird")) return "🐦";
    if (s.includes("mammal") || s.includes("rodent") || s.includes("rabbit")) return "🐹";
    return "🐾";
}

export default function Pets() {
    const [pets, setPets] = useState([]);
    // null = the pop-up is closed; otherwise it holds the pet being added or edited
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const fileInput = useRef(null);

    async function loadPets() {
        try {
            setPets(await api.get("/pets"));
            setError("");
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPets();
    }, []);

    function openAdd() {
        setFormError("");
        setEditing({ ...emptyPet });
    }

    function openEdit(pet) {
        setFormError("");
        setEditing({ ...pet });
    }

    function handleChange(event) {
        setEditing({ ...editing, [event.target.name]: event.target.value });
    }

    async function handlePhoto(event) {
        const file = event.target.files[0];
        if (!file) return;
        try {
            const photo = await resizeImage(file);
            setEditing((current) => ({ ...current, photo }));
            setFormError("");
        } catch {
            setFormError("Could not read that image. Please try another photo.");
        }
        event.target.value = ""; // lets you pick the same file again later
    }

    async function handleSave(event) {
        event.preventDefault();
        setSaving(true);
        setFormError("");

        const payload = {
            name: editing.name,
            species: editing.species,
            breed: editing.breed,
            age: Number(editing.age),
            ownerName: editing.ownerName,
            photo: editing.photo,
        };

        try {
            if (editing.id) {
                await api.put(`/pets/${editing.id}`, payload); // UPDATE an existing pet
            } else {
                await api.post("/pets", payload); // CREATE a new pet
            }
            setEditing(null);
            loadPets();
        } catch (e) {
            setFormError(e.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(pet) {
        if (!window.confirm(`Delete ${pet.name}?`)) return;
        try {
            await api.delete(`/pets/${pet.id}`);
            loadPets();
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <section>
            <div className="page-header">
                <div>
                    <h2>My Pets</h2>
                    <p className="muted">Manage your pets' profiles and photos</p>
                </div>
                <button onClick={openAdd}>
                    <PlusIcon /> Add pet
                </button>
            </div>

            {error && <p className="error">{error}</p>}

            {loading ? (
                <p className="muted">Loading...</p>
            ) : pets.length === 0 ? (
                <div className="empty">
                    🐾
                    <p>No pets yet. Add your first pet!</p>
                </div>
            ) : (
                <div className="pet-grid">
                    {pets.map((pet) => (
                        <article className="pet-card" key={pet.id}>
                            <div className="pet-photo">
                                {pet.photo ? (
                                    <img src={pet.photo} alt={pet.name} />
                                ) : (
                                    <span className="pet-emoji">{speciesEmoji(pet.species)}</span>
                                )}
                            </div>

                            <div className="pet-body">
                                <h3>{pet.name}</h3>
                                <div className="chips">
                                    <span className="chip">{pet.species}</span>
                                    {pet.breed && <span className="chip chip-soft">{pet.breed}</span>}
                                </div>
                                <p className="pet-meta">
                                    {pet.age} {pet.age === 1 ? "year" : "years"} old
                                </p>
                                <p className="pet-meta">Owner: {pet.ownerName}</p>
                            </div>

                            <div className="pet-actions">
                                <button className="icon-btn" title="Edit" onClick={() => openEdit(pet)}>
                                    <EditIcon />
                                </button>
                                <button className="icon-btn delete" title="Delete" onClick={() => handleDelete(pet)}>
                                    <TrashIcon />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {editing && (
                <Modal title={editing.id ? "Edit pet" : "Add a new pet"} onClose={() => setEditing(null)}>
                    <form className="modal-form" onSubmit={handleSave}>
                        <div className="photo-upload">
                            <div className="photo-preview">
                                {editing.photo ? (
                                    <img src={editing.photo} alt="Pet preview" />
                                ) : (
                                    <span>{speciesEmoji(editing.species)}</span>
                                )}
                            </div>
                            <div>
                                <button type="button" className="secondary" onClick={() => fileInput.current.click()}>
                                    <CameraIcon /> {editing.photo ? "Change photo" : "Upload photo"}
                                </button>
                                {editing.photo && (
                                    <button
                                        type="button"
                                        className="link-btn"
                                        onClick={() => setEditing({ ...editing, photo: null })}
                                    >
                                        Remove
                                    </button>
                                )}
                                <input ref={fileInput} type="file" accept="image/*" hidden onChange={handlePhoto} />
                                <p className="hint">JPG, PNG or WEBP. It is resized automatically.</p>
                            </div>
                        </div>

                        <label>
                            Name
                            <input name="name" value={editing.name} onChange={handleChange} required />
                        </label>

                        <label>
                            Species
                            <select name="species" value={editing.species} onChange={handleChange} required>
                                {SPECIES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                                {/* keeps an older value (for example "Rabbit") visible when editing */}
                                {editing.species && !SPECIES.includes(editing.species) && (
                                    <option value={editing.species}>{editing.species}</option>
                                )}
                            </select>
                        </label>

                        <label>
                            Breed
                            <input name="breed" value={editing.breed ?? ""} onChange={handleChange} />
                        </label>

                        <label>
                            Age (years)
                            <input name="age" type="number" min="0" value={editing.age} onChange={handleChange} required />
                        </label>

                        <label>
                            Owner name
                            <input name="ownerName" value={editing.ownerName} onChange={handleChange} required />
                        </label>

                        {formError && <p className="error">{formError}</p>}

                        <div className="modal-actions">
                            <button type="button" className="secondary" onClick={() => setEditing(null)}>
                                Cancel
                            </button>
                            <button type="submit" disabled={saving}>
                                {saving ? "Saving..." : "Save pet"}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </section>
    );
}