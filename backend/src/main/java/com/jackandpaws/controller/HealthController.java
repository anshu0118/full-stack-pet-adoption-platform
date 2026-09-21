package com.jackandpaws.controller;

import java.time.Instant;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/health")
public class HealthController {
    @GetMapping
    public Map<String, Object> health() {
        return Map.of("status", "UP", "service", "jack-and-paws-api", "timestamp", Instant.now().toString());
    }
}
