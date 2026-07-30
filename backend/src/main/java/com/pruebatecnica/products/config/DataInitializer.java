package com.pruebatecnica.products.config;

import com.pruebatecnica.products.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!users.existsByEmailIgnoreCase("admin@demo.com")) {
            users.save(AppUser.builder()
                    .email("admin@demo.com")
                    .password(passwordEncoder.encode("Admin123!"))
                    .role(Role.ADMIN)
                    .build());
        }
    }
}
