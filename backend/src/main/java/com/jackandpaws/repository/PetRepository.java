package com.jackandpaws.repository;

import com.jackandpaws.model.Pet;
import com.jackandpaws.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Long> {

    @Query("""
        select p from Pet p
        where p.adoptionStatus = :status
        and (
            :search is null
            or lower(p.name) like lower(concat('%', :search, '%'))
            or lower(p.breed) like lower(concat('%', :search, '%'))
        )
        and (:species is null or p.species = :species)
        and (:size is null or p.size = :size)
        and (:gender is null or p.gender = :gender)
        order by p.createdAt desc
    """)
    Page<Pet> search(
        @Param("search") String search,
        @Param("species") Pet.Species species,
        @Param("size") Pet.Size size,
        @Param("gender") Pet.Gender gender,
        @Param("status") Pet.AdoptionStatus status,
        Pageable pageable
    );

    @Query("""
        select p from Pet p
        where p.shelter = :shelter
        and p.adoptionStatus <> com.jackandpaws.model.Pet.AdoptionStatus.REMOVED
        order by p.createdAt desc
    """)
    List<Pet> findActiveByShelterOrderByCreatedAtDesc(
        @Param("shelter") User shelter
    );

    long countByShelter(User shelter);

    long countByShelterAndAdoptionStatus(
        User shelter,
        Pet.AdoptionStatus status
    );
}