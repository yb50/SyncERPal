package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.AppUser;
import com.yb.SyncERPal.service.AppUserService;
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
}
