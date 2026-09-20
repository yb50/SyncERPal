package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.AppUser;
import com.yb.SyncERPal.model.CreateUserRequest;
import com.yb.SyncERPal.model.UpdateUserRoleRequest;
import com.yb.SyncERPal.service.AppUserService;
import com.yb.SyncERPal.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class AppUserController {

    private final AppUserService appUserService;
    private final AuthService authService;

    public AppUserController(
            AppUserService appUserService,
            AuthService authService
    ) {
        this.appUserService = appUserService;
        this.authService = authService;
    }

    @GetMapping("/users")
    public List<AppUser> getAllUsers() {
        return appUserService.getAllUsers();
    }

    @PostMapping("/users")
    public AppUser createUser(
            @RequestBody CreateUserRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        String performedBy = "setup";

        if (!appUserService.isFirstUserSetupRequired()) {
            AppUser currentUser = authService.getAuthenticatedUser(authorizationHeader);
            performedBy = currentUser.getUsername();
        }

        return appUserService.createUser(request, performedBy);
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<AppUser> updateUserRole(
            @PathVariable Long id,
            @RequestBody UpdateUserRoleRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        AppUser currentUser = authService.getAuthenticatedUser(authorizationHeader);

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
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        AppUser currentUser = authService.getAuthenticatedUser(authorizationHeader);

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