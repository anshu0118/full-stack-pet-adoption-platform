package com.jackandpaws.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private final Key key;
    private final long ttl;

    public JwtService(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.ttl-hours:12}") long ttl) {
        if (secret.length() < 32)
            throw new IllegalArgumentException("JWT secret must be at least 32 characters");
        key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.ttl = ttl;
    }

    public String create(Long userId, String email, String role) {
        Instant now = Instant.now();
        return Jwts.builder().subject(String.valueOf(userId)).claim("email", email).claim("role", role)
                .issuedAt(Date.from(now)).expiration(Date.from(now.plusSeconds(ttl * 3600))).signWith(key).compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parser().verifyWith((javax.crypto.SecretKey) key).build().parseSignedClaims(token);
    }
}
