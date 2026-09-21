package com.jackandpaws.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(
    name = "pets",
    indexes = {
        @Index(name = "idx_pet_status", columnList = "adoption_status"),
        @Index(name = "idx_pet_species", columnList = "species"),
        @Index(name = "idx_pet_location", columnList = "location")
    }
)
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Species species;

    @Column(nullable = false)
    String breed;

    @Column(nullable = false)
    int age;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Size size;

    @Column(nullable = false)
    String location;

    @Column(nullable = false, length = 1600)
    String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    AdoptionStatus adoptionStatus = AdoptionStatus.AVAILABLE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    EnergyLevel energyLevel = EnergyLevel.MEDIUM;

    boolean vaccinated;
    boolean neutered;
    boolean goodWithChildren;
    boolean goodWithDogs;
    boolean goodWithCats;

    String imageUrl;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shelter_id")
    User shelter;

    @Column(nullable = false)
    Instant createdAt = Instant.now();

    public enum Species {
        DOG, CAT
    }

    public enum Gender {
        MALE, FEMALE
    }

    public enum Size {
        SMALL, MEDIUM, LARGE
    }

    public enum AdoptionStatus {
        AVAILABLE, APPLICATION_PENDING, ADOPTED, REMOVED
    }

    public enum EnergyLevel {
        LOW, MEDIUM, HIGH
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String v) {
        name = v;
    }

    public Species getSpecies() {
        return species;
    }

    public void setSpecies(Species v) {
        species = v;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String v) {
        breed = v;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int v) {
        age = v;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender v) {
        gender = v;
    }

    public Size getSize() {
        return size;
    }

    public void setSize(Size v) {
        size = v;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String v) {
        location = v;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String v) {
        description = v;
    }

    public AdoptionStatus getAdoptionStatus() {
        return adoptionStatus;
    }

    public void setAdoptionStatus(AdoptionStatus v) {
        adoptionStatus = v;
    }

    public EnergyLevel getEnergyLevel() {
        return energyLevel;
    }

    public void setEnergyLevel(EnergyLevel v) {
        energyLevel = v;
    }

    public boolean isVaccinated() {
        return vaccinated;
    }

    public void setVaccinated(boolean v) {
        vaccinated = v;
    }

    public boolean isNeutered() {
        return neutered;
    }

    public void setNeutered(boolean v) {
        neutered = v;
    }

    public boolean isGoodWithChildren() {
        return goodWithChildren;
    }

    public void setGoodWithChildren(boolean v) {
        goodWithChildren = v;
    }

    public boolean isGoodWithDogs() {
        return goodWithDogs;
    }

    public void setGoodWithDogs(boolean v) {
        goodWithDogs = v;
    }

    public boolean isGoodWithCats() {
        return goodWithCats;
    }

    public void setGoodWithCats(boolean v) {
        goodWithCats = v;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String v) {
        imageUrl = v;
    }

    public User getShelter() {
        return shelter;
    }

    public void setShelter(User v) {
        shelter = v;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}