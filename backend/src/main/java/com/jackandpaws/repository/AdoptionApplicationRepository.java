package com.jackandpaws.repository;

import com.jackandpaws.model.AdoptionApplication;
import com.jackandpaws.model.Pet;
import com.jackandpaws.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdoptionApplicationRepository
        extends JpaRepository<AdoptionApplication, Long> {

    @EntityGraph(attributePaths = {"pet", "user"})
    List<AdoptionApplication> findByUserOrderByCreatedAtDesc(User user);

    boolean existsByUserAndPetAndStatusNot(
            User user,
            Pet pet,
            AdoptionApplication.Status status
    );

    @EntityGraph(attributePaths = {"pet", "user"})
    List<AdoptionApplication> findByPet_ShelterOrderByCreatedAtDesc(
            User shelter
    );

    long countByPet_ShelterAndStatus(
            User shelter,
            AdoptionApplication.Status status
    );
}