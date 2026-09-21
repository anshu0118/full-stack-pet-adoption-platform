package com.jackandpaws.controller;
import com.jackandpaws.dto.AdoptionDtos.ApplicationResponse;
import com.jackandpaws.model.AdoptionApplication;
import com.jackandpaws.service.AdoptionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final AdoptionService service;
    public AdminController(AdoptionService service){this.service=service;}
    @PatchMapping("/applications/{id}/status")
    public ApplicationResponse updateStatus(@PathVariable Long id,@RequestParam AdoptionApplication.Status status){return service.updateStatus(id,status);}
}
