package com.yb.SyncERPal.repository;

import com.yb.SyncERPal.model.AppUser;
import com.yb.SyncERPal.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppUserJpaRepository extends JpaRepository<AppUser, Long> {
    boolean existsByUsername(String username);

    Optional<AppUser> findByUsername(String username);

    long countByRole(UserRole role);
}
