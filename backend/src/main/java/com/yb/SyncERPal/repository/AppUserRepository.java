package com.yb.SyncERPal.repository;

import com.yb.SyncERPal.model.AppUser;
import com.yb.SyncERPal.model.UserRole;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AppUserRepository {

    private final AppUserJpaRepository appUserJpaRepository;

    public AppUserRepository(AppUserJpaRepository appUserJpaRepository) {
        this.appUserJpaRepository = appUserJpaRepository;
    }

    public List<AppUser> findAll() {
        return appUserJpaRepository.findAll();
    }

    public AppUser save(AppUser appUser) {
        return appUserJpaRepository.save(appUser);
    }

    public boolean existsByUsername(String username) {
        return appUserJpaRepository.existsByUsername(username);
    }

    public AppUser findByUsername(String username) {
        return appUserJpaRepository.findByUsername(username).orElse(null);
    }

    public long countUsers() {
        return appUserJpaRepository.count();
    }

    public AppUser findById(Long id) {
        return appUserJpaRepository.findById(id).orElse(null);
    }

    public long countByRole(UserRole role) {
        return appUserJpaRepository.countByRole(role);
    }

    public void delete(AppUser appUser) {
        appUserJpaRepository.delete(appUser);
    }
}
