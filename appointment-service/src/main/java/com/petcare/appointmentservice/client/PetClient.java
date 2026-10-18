package com.petcare.appointmentservice.client;

import com.petcare.appointmentservice.exception.ServiceUnavailableException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
public class PetClient {

    private final RestClient restClient;

    public PetClient(@Value("${app.pet-service.url}") String baseUrl,
                     @Value("${app.pet-service.api-key}") String apiKey) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("X-API-KEY", apiKey)
                .build();
    }

    public boolean petExists(Long petId) {
        try {
            restClient.get()
                    .uri("/pets/{id}", petId)
                    .retrieve()
                    .toBodilessEntity();
            return true;
        } catch (HttpClientErrorException.NotFound e) {
            return false;
        } catch (RestClientException e) {
            throw new ServiceUnavailableException("Pet Service is unavailable or rejected the request");
        }
    }
}