import { useEffect, useState } from "react";
import { api } from "../api";
import Modal from "../components/Modal";
import { EditIcon, TrashIcon, PlusIcon } from "../components/Icons";

const emptyService = {
    name: "",
    category: "VACCINATION",
    description: "",
    price: "",
    durationMinutes: 30,
};

const money = (value) =>
    Number(value).toLocaleString("en-LK", { style: "currency", currency: "LKR" });

export default function CareServices() {
    const [services, setServices] = useState([]);
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    async function loadServices() {
        try {
            setServices(await api.get("/care-services"));
            setError("");
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadServices();
    }, []);

    function openAdd() {
        setFormError("");
        setEditing({ ...emptyService });
    }

    function openEdit(service) {
        setFormError("");
        setEditing({ ...service, description: service.description ?? "" });
    }

    function handleChange(event) {
        setEditing({ ...editing, [event.target.name]: event.target.value });
    }

    async function handleSave(event) {
        event.preventDefault();
        setSaving(true);
        setFormError("");

        const payload = {
            name: editing.name,
            category: editing.category,
            description: editing.description,
            price: Number(editing.price),
            durationMinutes: Number(editing.durationMinutes),
        };

        try {
            if (editing.id) {
                await api.put(`/care-services/${editing.id}`, payload);
            } else {
                await api.post("/care-services", payload);
            }
            setEditing(null);
            loadServices();
        } catch (e) {
            setFormError(e.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(service) {
        if (!window.confirm(`Delete "${service.name}"?`)) return;
        try {
            await api.delete(`/care-services/${service.id}`);
            loadServices();
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <section>
            <div className="page-header">
                <div>
                    <h2>Care Services</h2>
                    <p className="muted">Vaccinations, grooming, check-ups and their prices</p>
                </div>
                <button onClick={openAdd}>
                    <PlusIcon /> Add service
                </button>
            </div>

            {error && <p className="error">{error}</p>}

            {loading ? (
                <p className="muted">Loading...</p>
            ) : services.length === 0 ? (
                <div className="empty">
                    💉
                    <p>No care services yet. Add the first one!</p>
                </div>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Service</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Duration</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {services.map((s) => (
                        <tr key={s.id}>
                            <td><strong>{s.name}</strong></td>
                            <td><span className="chip">{s.category}</span></td>
                            <td>{s.description}</td>
                            <td>{money(s.price)}</td>
                            <td>{s.durationMinutes} min</td>
                            <td>
                                <div className="row-actions">
                                    <button className="icon-btn" title="Edit" onClick={() => openEdit(s)}>
                                        <EditIcon />
                                    </button>
                                    <button className="icon-btn delete" title="Delete" onClick={() => handleDelete(s)}>
                                        <TrashIcon />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {editing && (
                <Modal
                    title={editing.id ? "Edit care service" : "Add a care service"}
                    onClose={() => setEditing(null)}
                >
                    <form className="modal-form" onSubmit={handleSave}>
                        <label>
                            Name
                            <input name="name" value={editing.name} onChange={handleChange} required />
                        </label>

                        <label>
                            Category
                            <select name="category" value={editing.category} onChange={handleChange}>
                                <option value="VACCINATION">VACCINATION</option>
                                <option value="GROOMING">GROOMING</option>
                                <option value="CHECKUP">CHECKUP</option>
                            </select>
                        </label>

                        <label>
                            Description
                            <input name="description" value={editing.description} onChange={handleChange} />
                        </label>

                        <label>
                            Price (LKR)
                            <input
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={editing.price}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            Duration (minutes)
                            <input
                                name="durationMinutes"
                                type="number"
                                min="1"
                                value={editing.durationMinutes}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        {formError && <p className="error">{formError}</p>}

                        <div className="modal-actions">
                            <button type="button" className="secondary" onClick={() => setEditing(null)}>
                                Cancel
                            </button>
                            <button type="submit" disabled={saving}>
                                {saving ? "Saving..." : "Save service"}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </section>
    );
}