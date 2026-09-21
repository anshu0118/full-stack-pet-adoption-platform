package com.jackandpaws.service;

import com.jackandpaws.dto.AdoptionDtos.*;
import com.jackandpaws.exception.ApiException;
import com.jackandpaws.model.*;
import com.jackandpaws.repository.*;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdoptionService {

    final AdoptionApplicationRepository apps;
    final PetRepository pets;
    final CurrentUserService current;

    public AdoptionService(
            AdoptionApplicationRepository a,
            PetRepository p,
            CurrentUserService c
    ) {
        apps = a;
        pets = p;
        current = c;
    }

    public List<ApplicationResponse> list() {
        return apps.findByUserOrderByCreatedAtDesc(current.get())
                .stream()
                .map(ApplicationResponse::of)
                .toList();
    }

    public ApplicationResponse get(Long id) {
        User user = current.get();

        AdoptionApplication application = apps.findById(id)
                .orElseThrow(() -> new ApiException(404, "Application not found"));

        boolean admin = user.getRole() == User.Role.ADMIN;

        boolean applicant =
                application.getUser() != null
                && application.getUser().getId().equals(user.getId());

        boolean shelter =
                user.getRole() == User.Role.SHELTER
                && application.getPet().getShelter() != null
                && application.getPet().getShelter().getId().equals(user.getId());

        if (!admin && !applicant && !shelter) {
            throw new ApiException(403, "You cannot view this application");
        }

        return ApplicationResponse.of(application);
    }

    @Transactional
    public ApplicationResponse create(CreateApplication r) {

        User u = current.get();

        if (u.getRole() != User.Role.USER) {
            throw new ApiException(
                    403,
                    "Only adopter accounts can submit applications"
            );
        }

        Pet p = pets.findById(r.petId())
                .orElseThrow(() -> new ApiException(404, "Pet not found"));

        if (p.getAdoptionStatus() != Pet.AdoptionStatus.AVAILABLE) {
            throw new ApiException(
                    409,
                    "This pet is not currently available"
            );
        }

        if (apps.existsByUserAndPetAndStatusNot(
                u,
                p,
                AdoptionApplication.Status.REJECTED
        )) {
            throw new ApiException(
                    409,
                    "You already have an active application for this pet"
            );
        }

        AdoptionApplication a = new AdoptionApplication();

        a.setUser(u);
        a.setPet(p);
        a.setHousingType(r.housingType().trim());
        a.setHasYard(r.hasYard());
        a.setHasOtherPets(r.hasOtherPets());
        a.setExperience(
                r.experience() == null
                        ? null
                        : r.experience().trim()
        );
        a.setMessage(r.message().trim());

        AdoptionApplication saved = apps.save(a);

        p.setAdoptionStatus(Pet.AdoptionStatus.APPLICATION_PENDING);
        pets.save(p);

        return ApplicationResponse.of(saved);
    }

    public List<ApplicationResponse> shelterApplications() {

        User shelter = current.get();

        if (shelter.getRole() != User.Role.SHELTER) {
            throw new ApiException(
                    403,
                    "Only shelter accounts can view shelter applications"
            );
        }

        return apps.findByPet_ShelterOrderByCreatedAtDesc(shelter)
                .stream()
                .map(ApplicationResponse::of)
                .toList();
    }

    @Transactional
    public ApplicationResponse updateStatus(
            Long id,
            AdoptionApplication.Status status
    ) {

        AdoptionApplication a = apps.findById(id)
                .orElseThrow(() ->
                        new ApiException(404, "Application not found")
                );

        User user = current.get();

        boolean admin = user.getRole() == User.Role.ADMIN;

        boolean ownerShelter =
                user.getRole() == User.Role.SHELTER
                && a.getPet().getShelter() != null
                && a.getPet().getShelter().getId().equals(user.getId());

        if (!admin && !ownerShelter) {
            throw new ApiException(
                    403,
                    "You cannot manage this application"
            );
        }

        a.setStatus(status);

        if (status == AdoptionApplication.Status.APPROVED) {

            a.getPet().setAdoptionStatus(
                    Pet.AdoptionStatus.ADOPTED
            );

        } else if (status == AdoptionApplication.Status.REJECTED) {

            a.getPet().setAdoptionStatus(
                    Pet.AdoptionStatus.AVAILABLE
            );

        } else if (
                status == AdoptionApplication.Status.SUBMITTED
                || status == AdoptionApplication.Status.UNDER_REVIEW
                || status == AdoptionApplication.Status.MEET_AND_GREET
        ) {

            a.getPet().setAdoptionStatus(
                    Pet.AdoptionStatus.APPLICATION_PENDING
            );
        }

        apps.save(a);
        pets.save(a.getPet());

        return ApplicationResponse.of(a);
    }
}