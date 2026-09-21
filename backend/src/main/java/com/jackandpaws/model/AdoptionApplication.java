package com.jackandpaws.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(
    name = "adoption_applications",
    indexes = {
        @Index(name = "idx_app_user", columnList = "user_id"),
        @Index(name = "idx_app_pet", columnList = "pet_id")
    }
)
public class AdoptionApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pet_id", nullable = false)
    Pet pet;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Status status = Status.SUBMITTED;

    @Column(nullable = false)
    String housingType;

    boolean hasYard;
    boolean hasOtherPets;

    @Column(length = 2000)
    String experience;

    @Column(nullable = false, length = 2000)
    String message;

    @Column(nullable = false)
    Instant createdAt = Instant.now();

    public enum Status {
        SUBMITTED,
        UNDER_REVIEW,
        MEET_AND_GREET,
        APPROVED,
        REJECTED
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Pet getPet() {
        return pet;
    }

    public void setPet(Pet pet) {
        this.pet = pet;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getHousingType() {
        return housingType;
    }

    public void setHousingType(String housingType) {
        this.housingType = housingType;
    }

    public boolean isHasYard() {
        return hasYard;
    }

    public void setHasYard(boolean hasYard) {
        this.hasYard = hasYard;
    }

    public boolean isHasOtherPets() {
        return hasOtherPets;
    }

    public void setHasOtherPets(boolean hasOtherPets) {
        this.hasOtherPets = hasOtherPets;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}