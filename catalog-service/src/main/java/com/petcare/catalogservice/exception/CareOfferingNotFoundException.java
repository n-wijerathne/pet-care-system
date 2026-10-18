package com.petcare.catalogservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class CareOfferingNotFoundException extends RuntimeException {
    public CareOfferingNotFoundException(Long id) {
        super("Care service not found with id: " + id);
    }
}