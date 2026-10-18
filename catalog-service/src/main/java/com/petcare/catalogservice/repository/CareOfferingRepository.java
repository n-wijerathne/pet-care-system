package com.petcare.catalogservice.repository;

import com.petcare.catalogservice.model.CareOffering;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CareOfferingRepository extends JpaRepository<CareOffering, Long> {
}