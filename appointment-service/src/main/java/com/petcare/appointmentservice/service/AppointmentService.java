package com.petcare.appointmentservice.service;

import com.petcare.appointmentservice.client.CatalogClient;
import com.petcare.appointmentservice.client.PetClient;
import com.petcare.appointmentservice.exception.AppointmentNotFoundException;
import com.petcare.appointmentservice.exception.InvalidReferenceException;
import com.petcare.appointmentservice.model.Appointment;
import com.petcare.appointmentservice.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;
    private final PetClient petClient;
    private final CatalogClient catalogClient;

    public AppointmentService(AppointmentRepository repository,
                              PetClient petClient,
                              CatalogClient catalogClient) {
        this.repository = repository;
        this.petClient = petClient;
        this.catalogClient = catalogClient;
    }

    public List<Appointment> getAll() {
        return repository.findAll();
    }

    public Appointment getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new AppointmentNotFoundException(id));
    }

    public Appointment create(Appointment appointment) {
        validateReferences(appointment);
        appointment.setId(null);
        appointment.setStatus("BOOKED");
        return repository.save(appointment);
    }

    public Appointment update(Long id, Appointment updated) {
        Appointment existing = getById(id);
        validateReferences(updated);
        existing.setPetId(updated.getPetId());
        existing.setCareServiceId(updated.getCareServiceId());
        existing.setAppointmentDateTime(updated.getAppointmentDateTime());
        existing.setNotes(updated.getNotes());
        return repository.save(existing);
    }

    public Appointment cancel(Long id) {
        Appointment existing = getById(id);
        existing.setStatus("CANCELLED");
        return repository.save(existing);
    }

    public void delete(Long id) {
        Appointment existing = getById(id);
        repository.delete(existing);
    }

    // Ask the other two services whether the pet and care service really exist
    private void validateReferences(Appointment appointment) {
        if (!petClient.petExists(appointment.getPetId())) {
            throw new InvalidReferenceException("Pet not found with id: " + appointment.getPetId());
        }
        if (!catalogClient.careServiceExists(appointment.getCareServiceId())) {
            throw new InvalidReferenceException("Care service not found with id: " + appointment.getCareServiceId());
        }
    }
}