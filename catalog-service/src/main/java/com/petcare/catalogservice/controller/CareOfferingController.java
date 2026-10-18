package com.petcare.catalogservice.controller;

import com.petcare.catalogservice.model.CareOffering;
import com.petcare.catalogservice.service.CareOfferingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/care-services")
@Tag(name = "Care Services", description = "Manage the catalog of care services and prices")
public class CareOfferingController {

    private final CareOfferingService service;

    public CareOfferingController(CareOfferingService service) {
        this.service = service;
    }

    @GetMapping
    public List<CareOffering> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public CareOffering getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<CareOffering> create(@Valid @RequestBody CareOffering offering) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(offering));
    }

    @PutMapping("/{id}")
    public CareOffering update(@PathVariable Long id, @Valid @RequestBody CareOffering offering) {
        return service.update(id, offering);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}