package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.AppUser;
import com.yb.SyncERPal.service.AppUserService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
