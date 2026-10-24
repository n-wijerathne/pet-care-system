import { useEffect, useState } from "react";
import { api } from "../api";

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [pets, setPets] = useState([]);
    const [services, setServices] = useState([]);
    const [form, setForm] = useState({ petId: "", careServiceId: "", appointmentDateTime: "", notes: "" });
    const [error, setError] = useState("");

    // Load data from the Appointment, Pet and Catalog services
    async function loadAll() {
        try {
            const [a, p, s] = await Promise.all([
                api.get("/appointments"),
                api.get("/pets"),
                api.get("/care-services"),
            ]);
            setAppointments(a);
            setPets(p);
            setServices(s);
            setError("");
        } catch (e) {
            setError(e.message);
        }
    }

    useEffect(() => {
        loadAll();
    }, []);

    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            await api.post("/appointments", {
                petId: Number(form.petId),
                careServiceId: Number(form.careServiceId),
                appointmentDateTime: form.appointmentDateTime,
                notes: form.notes,
            });
            setForm({ petId: "", careServiceId: "", appointmentDateTime: "", notes: "" });
            loadAll();
        } catch (e) {
            setError(e.message);
        }
    }

    async function handleCancel(id) {
        try {
            await api.patch(`/appointments/${id}/cancel`);
            loadAll();
        } catch (e) {
            setError(e.message);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Delete this appointment?")) return;
        try {
            await api.delete(`/appointments/${id}`);
            loadAll();
        } catch (e) {
            setError(e.message);
        }
    }

    // Turn ids into readable names
    const petName = (id) => pets.find((p) => p.id === id)?.name ?? `#${id}`;
    const serviceName = (id) => services.find((s) => s.id === id)?.name ?? `#${id}`;

    return (
        <section>
            <h2>Appointments</h2>
            {error && <p className="error">{error}</p>}

            <form className="card form" onSubmit={handleSubmit}>
                <select name="petId" value={form.petId} onChange={handleChange} required>
                    <option value="">Choose a pet</option>
                    {pets.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.species})</option>
                    ))}
                </select>
                <select name="careServiceId" value={form.careServiceId} onChange={handleChange} required>
                    <option value="">Choose a care service</option>
                    {services.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} ({s.price})</option>
                    ))}
                </select>
                <input name="appointmentDateTime" type="datetime-local" value={form.appointmentDateTime} onChange={handleChange} required />
                <input name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />
                <button type="submit">Book appointment</button>
            </form>

            <table>
                <thead>
                <tr><th>ID</th><th>Pet</th><th>Care service</th><th>Date and time</th><th>Status</th><th>Notes</th><th></th></tr>
                </thead>
                <tbody>
                {appointments.map((a) => (
                    <tr key={a.id}>
                        <td>{a.id}</td>
                        <td>{petName(a.petId)}</td>
                        <td>{serviceName(a.careServiceId)}</td>
                        <td>{a.appointmentDateTime.replace("T", " ")}</td>
                        <td><span className={`badge ${a.status}`}>{a.status}</span></td>
                        <td>{a.notes}</td>
                        <td className="actions">
                            {a.status === "BOOKED" && (
                                <button className="secondary" onClick={() => handleCancel(a.id)}>Cancel</button>
                            )}
                            <button className="danger" onClick={() => handleDelete(a.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {appointments.length === 0 && <p className="muted">No appointments yet.</p>}
        </section>
    );
}