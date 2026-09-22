package com.yb.SyncERPal.service;

import com.yb.SyncERPal.exception.UnauthorizedException;
import com.yb.SyncERPal.model.*;
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

    public AuthenticatedUserResponse getCurrentUser(String authorizationHeader) {
        AppUser appUser = getAuthenticatedUser(authorizationHeader);

        return new AuthenticatedUserResponse(
                appUser.getId(),
                appUser.getUsername(),
                appUser.getRole()
        );
    }

    public void logout(String authorizationHeader) {
        String token = extractToken(authorizationHeader);

        AuthToken authToken = authTokenRepository.findByToken(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid authentication token."));

        authTokenRepository.delete(authToken);
    }

    public AppUser getAuthenticatedUser(String authorizationHeader) {
        String token = extractToken(authorizationHeader);

        AuthToken authToken = authTokenRepository.findByToken(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid authentication token."));

        if (authToken.getExpiresAt() != null &&
                authToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new UnauthorizedException("Authentication token has expired.");
        }

        AppUser appUser = appUserRepository.findById(authToken.getUserId());

        if (appUser == null) {
            throw new UnauthorizedException("Authenticated user no longer exists.");
        }

        return appUser;
    }

    private String extractToken(String authorizationHeader) {
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            throw new UnauthorizedException("Authorization header is required.");
        }

        if (!authorizationHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Bearer token is required.");
        }

        String token = authorizationHeader.substring(7);

        if (token.isBlank()) {
            throw new UnauthorizedException("Authentication token is required.");
        }

        return token;
    }
}