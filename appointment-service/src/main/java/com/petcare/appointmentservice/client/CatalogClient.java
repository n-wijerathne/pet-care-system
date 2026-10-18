package com.petcare.appointmentservice.client;

import com.petcare.appointmentservice.exception.ServiceUnavailableException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
public class CatalogClient {

    private final RestClient restClient;

    public CatalogClient(@Value("${app.catalog-service.url}") String baseUrl,
                         @Value("${app.catalog-service.api-key}") String apiKey) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("X-API-KEY", apiKey)
                .build();
    }

    public boolean careServiceExists(Long careServiceId) {
        try {
            restClient.get()
                    .uri("/care-services/{id}", careServiceId)
                    .retrieve()
                    .toBodilessEntity();
            return true;
        } catch (HttpClientErrorException.NotFound e) {
            return false;
        } catch (RestClientException e) {
            throw new ServiceUnavailableException("Catalog Service is unavailable or rejected the request");
        }
    }
}