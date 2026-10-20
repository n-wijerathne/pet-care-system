package com.petcare.apigateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

@Configuration
public class RateLimiterConfig {

    // Decides WHO is being limited: here, the client's IP address
    @Bean
    public KeyResolver ipKeyResolver() {
        return exchange -> {
            var address = exchange.getRequest().getRemoteAddress();
            String ip = (address != null) ? address.getAddress().getHostAddress() : "unknown";
            return Mono.just(ip);
        };
    }

    // Decides HOW MUCH: tokens refilled per second, bucket size, and cost of 1 token per request
    @Bean
    public RedisRateLimiter redisRateLimiter(
            @Value("${app.rate-limit.replenish-rate}") int replenishRate,
            @Value("${app.rate-limit.burst-capacity}") int burstCapacity) {
        return new RedisRateLimiter(replenishRate, burstCapacity, 1);
    }
}