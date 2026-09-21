package com.jackandpaws.dto;

import jakarta.validation.constraints.*;
import com.jackandpaws.model.User;

public final class AuthDtos {
    private AuthDtos() {
    }

    public record RegisterRequest(@NotBlank @Size(max = 80) String name, @NotBlank @Email @Size(max = 160) String email,
            @NotBlank @Size(min = 8, max = 72) String password) {
    }

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {
    }

    public record UserResponse(Long id, String name, String email, String role) {
        public static UserResponse of(User u) {
            return new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole().name());
        }
    }

    public record AuthResponse(String token, UserResponse user) {
    }
}
