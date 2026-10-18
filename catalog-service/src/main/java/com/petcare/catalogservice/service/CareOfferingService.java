package com.petcare.catalogservice.service;

import com.petcare.catalogservice.exception.CareOfferingNotFoundException;
import com.petcare.catalogservice.model.CareOffering;
import com.petcare.catalogservice.repository.CareOfferingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CareOfferingService {

    private final CareOfferingRepository repository;

    public CareOfferingService(CareOfferingRepository repository) {
        this.repository = repository;
    }

    public List<CareOffering> getAll() {
        return repository.findAll();
    }

    public CareOffering getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new CareOfferingNotFoundException(id));
    }

    public CareOffering create(CareOffering offering) {
        offering.setId(null);
        return repository.save(offering);
    }

    public CareOffering update(Long id, CareOffering updated) {
        CareOffering existing = getById(id);
        existing.setName(updated.getName());
        existing.setCategory(updated.getCategory());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setDurationMinutes(updated.getDurationMinutes());
        return repository.save(existing);
    }

    public void delete(Long id) {
        CareOffering existing = getById(id);
        repository.delete(existing);
    }
}