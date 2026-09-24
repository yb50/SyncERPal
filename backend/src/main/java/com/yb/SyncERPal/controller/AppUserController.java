package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.exception.UnauthorizedException;
import com.yb.SyncERPal.model.AppUser;
import com.yb.SyncERPal.model.CreateUserRequest;
import com.yb.SyncERPal.model.UpdateUserRoleRequest;
import com.yb.SyncERPal.service.AppUserService;
import com.yb.SyncERPal.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class AppUserController {

    private final AppUserService appUserService;

    public AppUserController(
            AppUserService appUserService
    ) {
        this.appUserService = appUserService;
    }

    @GetMapping("/users")
    public List<AppUser> getAllUsers() {
        return appUserService.getAllUsers();
    }

    @PostMapping("/users/setup")
    public AppUser setupFirstUser(@RequestBody CreateUserRequest request) {
        if (!appUserService.isFirstUserSetupRequired()) {
            throw new IllegalStateException("Initial setup has already been completed.");
        }

        return appUserService.createUser(request, "setup");
    }

    @PostMapping("/users")
    public AppUser createUser(
            @RequestBody CreateUserRequest request,
            @AuthenticationPrincipal AppUser currentUser
    ) {
        return appUserService.createUser(request, currentUser.getUsername());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<AppUser> updateUserRole(
            @PathVariable Long id,
            @RequestBody UpdateUserRoleRequest request,
            @AuthenticationPrincipal AppUser currentUser
    ) {
        AppUser updatedUser = appUserService.updateUserRole(
                id,
                request.getRole(),
                currentUser.getUsername()
        );

        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<AppUser> deleteUser(
            @PathVariable Long id,
            @AuthenticationPrincipal AppUser currentUser
    ) {
        AppUser deletedUser = appUserService.deleteUser(
                id,
                currentUser.getUsername()
        );

        if (deletedUser == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(deletedUser);
    }
}