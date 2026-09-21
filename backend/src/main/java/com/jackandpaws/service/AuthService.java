package com.jackandpaws.service;

import com.jackandpaws.dto.AuthDtos.*;
import com.jackandpaws.exception.ApiException;
import com.jackandpaws.model.User;
import com.jackandpaws.repository.UserRepository;
import com.jackandpaws.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    final UserRepository users;
    final PasswordEncoder encoder;
    final JwtService jwt;

    public AuthService(UserRepository u, PasswordEncoder e, JwtService j) {
        users = u;
        encoder = e;
        jwt = j;
    }

    @Transactional
    public AuthResponse register(RegisterRequest r) {
        String email = r.email().trim().toLowerCase();
        if (users.existsByEmail(email))
            throw new ApiException(409, "An account with that email already exists");
        User u = new User();
        u.setName(r.name().trim());
        u.setEmail(email);
        u.setPasswordHash(encoder.encode(r.password()));
        users.save(u);
        return response(u);
    }

    public AuthResponse login(LoginRequest r) {
        User u = users.findByEmail(r.email().trim().toLowerCase())
                .orElseThrow(() -> new ApiException(401, "Invalid email or password"));
        if (!encoder.matches(r.password(), u.getPasswordHash()))
            throw new ApiException(401, "Invalid email or password");
        return response(u);
    }

    private AuthResponse response(User u) {
        return new AuthResponse(jwt.create(u.getId(), u.getEmail(), u.getRole().name()), UserResponse.of(u));
    }
}
