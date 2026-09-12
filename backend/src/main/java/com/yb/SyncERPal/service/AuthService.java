package com.yb.SyncERPal.service;

import com.yb.SyncERPal.model.AppUser;
import com.yb.SyncERPal.model.LoginRequest;
import com.yb.SyncERPal.model.LoginResponse;
import com.yb.SyncERPal.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest request) {
        validateLoginRequest(request);

        AppUser appUser = appUserRepository.findByUsername(request.getUsername());

        if (appUser == null) {
            throw new IllegalArgumentException("Invalid username or password.");
        }

        if (appUser.getPasswordHash() == null ||
                !passwordEncoder.matches(request.getPassword(), appUser.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid username or password.");
        }

        return new LoginResponse(
                appUser.getId(),
                appUser.getUsername(),
                appUser.getRole()
        );
    }

    private void validateLoginRequest(LoginRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new IllegalArgumentException("Username is required.");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required.");
        }
    }
}