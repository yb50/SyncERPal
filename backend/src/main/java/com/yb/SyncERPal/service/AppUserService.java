package com.yb.SyncERPal.service;

import com.yb.SyncERPal.model.AppUser;
import com.yb.SyncERPal.model.UserRole;
import com.yb.SyncERPal.repository.AppUserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppUserService {

    private final AppUserRepository appUserRepository;
    private final AuditLogService auditLogService;

    public AppUserService(
            AppUserRepository appUserRepository,
            AuditLogService auditLogService
    ) {
        this.appUserRepository = appUserRepository;
        this.auditLogService = auditLogService;
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
        return createUser(appUser, "system");
    }

    public AppUser createUser(AppUser appUser, String performedBy) {
        if (appUserRepository.countUsers() > 0) {
            requireAdmin(performedBy);
        }

        validateUser(appUser);

        if (appUserRepository.existsByUsername(appUser.getUsername())) {
            throw new IllegalArgumentException("Username already exists.");
        }

        AppUser savedUser = appUserRepository.save(appUser);

        auditLogService.createAuditLog(
                "CREATE_USER",
                "USER",
                savedUser.getId(),
                "Created user: " + savedUser.getUsername() + " with role " + savedUser.getRole(),
                performedBy
        );

        return savedUser;
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

    public void requireAdmin(String username) {
        AppUser appUser = getUserByUsername(username);

        if (appUser == null) {
            throw new IllegalArgumentException("User does not exist.");
        }

        if (appUser.getRole() != UserRole.ADMIN) {
            throw new IllegalStateException("Only ADMIN users can perform this action.");
        }
    }

    public void requireExistingUser(String username) {
        AppUser appUser = getUserByUsername(username);

        if (appUser == null) {
            throw new IllegalArgumentException("User does not exist.");
        }
    }

    public AppUser updateUserRole(Long id, UserRole role, String performedBy) {
        requireAdmin(performedBy);

        if (role == null) {
            throw new IllegalArgumentException("User role is required.");
        }

        AppUser appUser = appUserRepository.findById(id);

        if (appUser == null) {
            return null;
        }

        UserRole oldRole = appUser.getRole();

        if (oldRole == UserRole.ADMIN && role != UserRole.ADMIN) {
            long adminCount = appUserRepository.countByRole(UserRole.ADMIN);

            if (adminCount <= 1) {
                throw new IllegalStateException("At least one ADMIN user is required.");
            }
        }

        appUser.setRole(role);

        AppUser updatedUser = appUserRepository.save(appUser);

        auditLogService.createAuditLog(
                "UPDATE_USER_ROLE",
                "USER",
                updatedUser.getId(),
                "Updated user role: " + updatedUser.getUsername() + " from " + oldRole + " to " + updatedUser.getRole(),
                performedBy
        );

        return updatedUser;
    }
}
