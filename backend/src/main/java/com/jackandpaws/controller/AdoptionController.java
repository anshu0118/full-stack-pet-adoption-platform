package com.jackandpaws.controller;

import com.jackandpaws.dto.AdoptionDtos.*;
import com.jackandpaws.service.AdoptionService;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
public class AdoptionController {
    final AdoptionService s;

    public AdoptionController(AdoptionService s) {
        this.s = s;
    }

    @GetMapping
    public List<ApplicationResponse> list() {
        return s.list();
    }

    @PostMapping
    public ApplicationResponse create(@Valid @RequestBody CreateApplication r) {
        return s.create(r);
    }
}
