package com.jackandpaws.dto;

import com.jackandpaws.model.AdoptionApplication;
import jakarta.validation.constraints.*;
import java.time.Instant;

public final class AdoptionDtos {

    private AdoptionDtos() {}

    public record CreateApplication(
            @NotNull Long petId,
            @NotBlank String housingType,
            boolean hasYard,
            boolean hasOtherPets,
            @Size(max = 2000) String experience,
            @NotBlank @Size(min = 20, max = 2000) String message
    ) {}

    public record ApplicationResponse(
            Long id,
            Long petId,
            String petName,
            AdoptionApplication.Status status,
            String housingType,
            boolean hasYard,
            boolean hasOtherPets,
            String experience,
            String message,
            Instant createdAt,
            String applicantName,
            String applicantEmail
    ) {
        public static ApplicationResponse of(AdoptionApplication a) {
            return new ApplicationResponse(
                    a.getId(),
                    a.getPet().getId(),
                    a.getPet().getName(),
                    a.getStatus(),
                    a.getHousingType(),
                    a.isHasYard(),
                    a.isHasOtherPets(),
                    a.getExperience(),
                    a.getMessage(),
                    a.getCreatedAt(),
                    a.getUser().getName(),
                    a.getUser().getEmail()
            );
        }
    }
}