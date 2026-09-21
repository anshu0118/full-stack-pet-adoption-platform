package com.jackandpaws.controller;

import com.jackandpaws.dto.AdoptionDtos.ApplicationResponse;
import com.jackandpaws.model.AdoptionApplication;
import com.jackandpaws.model.Pet;
import com.jackandpaws.repository.PetRepository;
import com.jackandpaws.service.AdoptionService;
import com.jackandpaws.service.CurrentUserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shelter")
@PreAuthorize("hasRole('SHELTER')")
public class ShelterController {

    private final AdoptionService adoptionService;
    private final PetRepository pets;
    private final CurrentUserService current;

    public ShelterController(
            AdoptionService adoptionService,
            PetRepository pets,
            CurrentUserService current
    ) {
        this.adoptionService = adoptionService;
        this.pets = pets;
        this.current = current;
    }

    @GetMapping("/pets")
    public List<Pet> pets() {
        return pets.findActiveByShelterOrderByCreatedAtDesc(current.get());
    }

    @GetMapping("/applications")
    public List<ApplicationResponse> applications() {
        return adoptionService.shelterApplications();
    }

    @PatchMapping("/applications/{id}/status")
    public ApplicationResponse updateStatus(
            @PathVariable Long id,
            @RequestParam AdoptionApplication.Status status
    ) {
        return adoptionService.updateStatus(id, status);
    }
}