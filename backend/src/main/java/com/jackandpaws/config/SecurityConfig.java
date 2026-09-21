package com.jackandpaws.config;

import com.jackandpaws.security.JwtAuthFilter;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
public class SecurityConfig {
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    SecurityFilterChain security(HttpSecurity http, JwtAuthFilter filter) throws Exception {
        return http.csrf(c -> c.disable()).cors(c -> {
        }).sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        a -> a.requestMatchers("/api/auth/**", "/api/pets/**", "/api/health", "/actuator/health")
                                .permitAll().anyRequest().authenticated())
                .addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class).build();
    }
}
