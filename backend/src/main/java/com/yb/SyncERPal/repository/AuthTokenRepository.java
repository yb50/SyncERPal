package com.yb.SyncERPal.repository;

import com.yb.SyncERPal.model.AuthToken;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class AuthTokenRepository {

    private final AuthTokenJpaRepository authTokenJpaRepository;

    public AuthTokenRepository(AuthTokenJpaRepository authTokenJpaRepository) {
        this.authTokenJpaRepository = authTokenJpaRepository;
    }

    public AuthToken save(AuthToken authToken) {
        return authTokenJpaRepository.save(authToken);
    }

    public Optional<AuthToken> findByToken(String token) {
        return authTokenJpaRepository.findByToken(token);
    }

    public void delete(AuthToken authToken) {
        authTokenJpaRepository.delete(authToken);
    }
}