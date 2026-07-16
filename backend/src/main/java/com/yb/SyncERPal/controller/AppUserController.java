package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.AppUser;
import com.yb.SyncERPal.model.UpdateUserRoleRequest;
import com.yb.SyncERPal.service.AppUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class AppUserController {

    private final AppUserService appUserService;

    public AppUserController(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

    @GetMapping("/users")
    public List<AppUser> getAllUsers() {
        return appUserService.getAllUsers();
    }

    @PostMapping("/users")
    public AppUser createUser(
            @RequestBody AppUser appUser,
            @RequestHeader(value = "X-user", defaultValue = "system") String performedBy
    ) {
        return appUserService.createUser(appUser, performedBy);
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<AppUser> updateUserRole(
            @PathVariable Long id,
            @RequestBody UpdateUserRoleRequest request,
            @RequestHeader(value = "X-User", defaultValue = "system") String performedBy
            ) {
        AppUser updatedUser = appUserService.updateUserRole(id, request.getRole(), performedBy);

        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("users/{id}")
    public ResponseEntity<AppUser> deleteUser(
            @PathVariable Long id,
            @RequestHeader(value = "X-User", defaultValue = "system") String performedBy
    ) {
        AppUser deletedUser = appUserService.deleteUser(id, performedBy);

        if (deletedUser == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(deletedUser);
    }
}
