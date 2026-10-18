package com.petcare.appointmentservice.controller;

import com.petcare.appointmentservice.model.Appointment;
import com.petcare.appointmentservice.service.AppointmentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@Tag(name = "Appointments", description = "Book, view, reschedule and cancel appointments")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Appointment> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Appointment getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<Appointment> create(@Valid @RequestBody Appointment appointment) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(appointment));
    }

    @PutMapping("/{id}")
    public Appointment update(@PathVariable Long id, @Valid @RequestBody Appointment appointment) {
        return service.update(id, appointment);
    }

    @PatchMapping("/{id}/cancel")
    public Appointment cancel(@PathVariable Long id) {
        return service.cancel(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}