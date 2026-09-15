package com.yb.SyncERPal.service;

import com.yb.SyncERPal.model.AppUser;
import com.yb.SyncERPal.model.AuthToken;
import com.yb.SyncERPal.model.LoginRequest;
import com.yb.SyncERPal.model.LoginResponse;
import com.yb.SyncERPal.repository.AppUserRepository;
import com.yb.SyncERPal.repository.AuthTokenRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthTokenRepository authTokenRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder,
            AuthTokenRepository authTokenRepository
    ) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.authTokenRepository = authTokenRepository;
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

        String token = generateToken();

        AuthToken authToken = new AuthToken(
                token,
                appUser.getId(),
                LocalDateTime.now().plusHours(8)
        );

        authTokenRepository.save(authToken);

        return new LoginResponse(
                appUser.getId(),
                appUser.getUsername(),
                appUser.getRole(),
                token
        );
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
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