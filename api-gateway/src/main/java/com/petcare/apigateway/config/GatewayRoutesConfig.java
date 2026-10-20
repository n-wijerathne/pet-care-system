package com.petcare.apigateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutesConfig {

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder,
                               RedisRateLimiter rateLimiter,
                               KeyResolver ipKeyResolver,
                               @Value("${app.pet-service.url}") String petUrl,
                               @Value("${app.pet-service.api-key}") String petKey,
                               @Value("${app.catalog-service.url}") String catalogUrl,
                               @Value("${app.catalog-service.api-key}") String catalogKey,
                               @Value("${app.appointment-service.url}") String appointmentUrl,
                               @Value("${app.appointment-service.api-key}") String appointmentKey) {

        return builder.routes()

                .route("pet-service", r -> r
                        .path("/pets", "/pets/**")
                        .filters(f -> f
                                .setRequestHeader("X-API-KEY", petKey)
                                .requestRateLimiter(c -> c
                                        .setRateLimiter(rateLimiter)
                                        .setKeyResolver(ipKeyResolver)))
                        .uri(petUrl))

                .route("catalog-service", r -> r
                        .path("/care-services", "/care-services/**")
                        .filters(f -> f
                                .setRequestHeader("X-API-KEY", catalogKey)
                                .requestRateLimiter(c -> c
                                        .setRateLimiter(rateLimiter)
                                        .setKeyResolver(ipKeyResolver)))
                        .uri(catalogUrl))

                .route("appointment-service", r -> r
                        .path("/appointments", "/appointments/**")
                        .filters(f -> f
                                .setRequestHeader("X-API-KEY", appointmentKey)
                                .requestRateLimiter(c -> c
                                        .setRateLimiter(rateLimiter)
                                        .setKeyResolver(ipKeyResolver)))
                        .uri(appointmentUrl))

                .build();
    }
}