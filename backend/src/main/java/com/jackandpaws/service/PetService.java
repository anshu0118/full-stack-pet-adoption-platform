package com.jackandpaws.service;

import com.jackandpaws.exception.ApiException;
import com.jackandpaws.model.Pet;
import com.jackandpaws.model.User;
import com.jackandpaws.repository.PetRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PetService {

    private final PetRepository pets;
    private final CurrentUserService current;

    public PetService(PetRepository p, CurrentUserService c) {
        pets = p;
        current = c;
    }

    public Page<Pet> search(
            String search,
            Pet.Species species,
            Pet.Size size,
            Pet.Gender gender,
            int page,
            int pageSize) {

        int safe = Math.min(Math.max(pageSize, 1), 30);

        return pets.search(
                blank(search),
                species,
                size,
                gender,
                Pet.AdoptionStatus.AVAILABLE,
                PageRequest.of(Math.max(page, 0), safe)
        );
    }

    public Pet get(Long id) {
        return pets.findById(id)
                .orElseThrow(() -> new ApiException(404, "Pet not found"));
    }

    @Transactional
    public Pet create(Pet pet) {
        User shelter = current.get();

        if (shelter.getRole() != User.Role.SHELTER) {
            throw new ApiException(403, "Only shelter accounts can add pets");
        }

        validatePet(pet);

        pet.setAdoptionStatus(Pet.AdoptionStatus.AVAILABLE);

        if (pet.getEnergyLevel() == null) {
            pet.setEnergyLevel(Pet.EnergyLevel.MEDIUM);
        }

        pet.setShelter(shelter);

        return pets.save(pet);
    }

    @Transactional
    public Pet update(Long id, Pet incoming) {
        User shelter = current.get();

        if (shelter.getRole() != User.Role.SHELTER) {
            throw new ApiException(403, "Only shelter accounts can manage pets");
        }

        Pet pet = pets.findById(id)
                .orElseThrow(() -> new ApiException(404, "Pet not found"));

        checkOwnership(pet, shelter);

        validatePet(incoming);

        pet.setName(incoming.getName());
        pet.setSpecies(incoming.getSpecies());
        pet.setBreed(incoming.getBreed());
        pet.setAge(incoming.getAge());
        pet.setGender(incoming.getGender());
        pet.setSize(incoming.getSize());
        pet.setLocation(incoming.getLocation());
        pet.setDescription(incoming.getDescription());
        pet.setEnergyLevel(
                incoming.getEnergyLevel() == null
                        ? Pet.EnergyLevel.MEDIUM
                        : incoming.getEnergyLevel()
        );
        pet.setVaccinated(incoming.isVaccinated());
        pet.setNeutered(incoming.isNeutered());
        pet.setGoodWithChildren(incoming.isGoodWithChildren());
        pet.setGoodWithDogs(incoming.isGoodWithDogs());
        pet.setGoodWithCats(incoming.isGoodWithCats());
        pet.setImageUrl(incoming.getImageUrl());

        return pets.save(pet);
    }

    @Transactional
    public void remove(Long id) {
        User shelter = current.get();

        if (shelter.getRole() != User.Role.SHELTER) {
            throw new ApiException(403, "Only shelter accounts can manage pets");
        }

        Pet pet = pets.findById(id)
                .orElseThrow(() -> new ApiException(404, "Pet not found"));

        checkOwnership(pet, shelter);

        if (pet.getAdoptionStatus() == Pet.AdoptionStatus.ADOPTED) {
            throw new ApiException(409, "An adopted pet cannot be removed");
        }

        pet.setAdoptionStatus(Pet.AdoptionStatus.REMOVED);
        pets.save(pet);
    }

    private void checkOwnership(Pet pet, User shelter) {
        if (pet.getShelter() == null
                || !pet.getShelter().getId().equals(shelter.getId())) {
            throw new ApiException(403, "You cannot manage this pet");
        }
    }

    private void validatePet(Pet pet) {
        if (pet.getName() == null || pet.getName().isBlank()) {
            throw new ApiException(400, "Pet name is required");
        }

        if (pet.getSpecies() == null) {
            throw new ApiException(400, "Species is required");
        }

        if (pet.getBreed() == null || pet.getBreed().isBlank()) {
            throw new ApiException(400, "Breed is required");
        }

        if (pet.getAge() < 0) {
            throw new ApiException(400, "Age cannot be negative");
        }

        if (pet.getGender() == null) {
            throw new ApiException(400, "Gender is required");
        }

        if (pet.getSize() == null) {
            throw new ApiException(400, "Size is required");
        }

        if (pet.getLocation() == null || pet.getLocation().isBlank()) {
            throw new ApiException(400, "Location is required");
        }

        if (pet.getDescription() == null || pet.getDescription().isBlank()) {
            throw new ApiException(400, "Description is required");
        }
    }

    private String blank(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}