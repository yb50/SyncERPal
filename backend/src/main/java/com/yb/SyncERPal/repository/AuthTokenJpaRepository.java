package com.yb.SyncERPal.repository;

import com.yb.SyncERPal.model.AuthToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthTokenJpaRepository extends JpaRepository<AuthToken, Long> {

    Optional<AuthToken> findByToken(String token);
}