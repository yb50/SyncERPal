package com.yb.SyncERPal.repository;

import com.yb.SyncERPal.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserJpaRepository extends JpaRepository<AppUser, Long> {
}
