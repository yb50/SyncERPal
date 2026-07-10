package com.yb.SyncERPal.service;

import com.yb.SyncERPal.model.AppUser;
import com.yb.SyncERPal.model.UserRole;
import com.yb.SyncERPal.repository.AppUserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppUserService {

    private final AppUserRepository appUserRepository;

    public AppUserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public List<AppUser> getAllUsers() {
        return appUserRepository.findAll();
    }

    private void validateUser(AppUser appUser) {
        if (appUser.getUsername() == null || appUser.getUsername().isBlank()) {
            throw new IllegalArgumentException("Username is required.");
        }

        if (appUser.getRole() == null) {
            throw new IllegalArgumentException("User role is required.");
        }
    }

    public AppUser createUser(AppUser appUser) {
        validateUser(appUser);

        if (appUserRepository.existsByUsername(appUser.getUsername())) {
            throw new IllegalArgumentException("Username already exists.");
        }

        return appUserRepository.save(appUser);
    }

    public AppUser getUserByUsername(String username) {
        return appUserRepository.findByUsername(username);
    }

    public void requireManagerOrAdmin(String username) {
        AppUser appUser = getUserByUsername(username);

        if (appUser == null) {
            throw new IllegalArgumentException("User does not exist.");
        }

        if (appUser.getRole() != UserRole.ADMIN && appUser.getRole() != UserRole.MANAGER) {
            throw new IllegalStateException("Only ADMIN or MANAGER users can perform this action.");
        }
    }
}
