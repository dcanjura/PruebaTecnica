package com.pruebatecnica.products.auth;

import com.pruebatecnica.products.security.JwtService;
import com.pruebatecnica.products.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email().toLowerCase(), request.password()));
        AppUser user = users.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new BadCredentialsException("Credenciales incorrectas"));
        return response(user);
    }

    public AuthResponse register(RegisterRequest request) {
        if (users.existsByEmailIgnoreCase(request.email())) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }
        AppUser user = users.save(AppUser.builder()
                .email(request.email().trim().toLowerCase())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .build());
        return response(user);
    }

    private AuthResponse response(AppUser user) {
        return new AuthResponse(jwtService.generateToken(user), user.getEmail(), user.getRole().name());
    }
}
