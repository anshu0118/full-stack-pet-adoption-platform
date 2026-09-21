package com.jackandpaws.controller;

import com.jackandpaws.model.Pet;
import com.jackandpaws.service.PetService;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetService service;

    public PetController(PetService service) {
        this.service = service;
    }

    @GetMapping
    public Page<Pet> search(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Pet.Species species,
            @RequestParam(required = false) Pet.Size size,
            @RequestParam(required = false) Pet.Gender gender,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int pageSize) {

        return service.search(
                search,
                species,
                size,
                gender,
                page,
                pageSize
        );
    }

    @GetMapping("/{id}")
    public Pet get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('SHELTER')")
    public Pet create(@RequestBody Pet pet) {
        return service.create(pet);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SHELTER')")
    public Pet update(
            @PathVariable Long id,
            @RequestBody Pet pet) {

        return service.update(id, pet);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SHELTER')")
    public void remove(@PathVariable Long id) {
        service.remove(id);
    }
}