package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.AuthenticatedUserResponse;
import com.yb.SyncERPal.model.LoginRequest;
import com.yb.SyncERPal.model.LoginResponse;
import com.yb.SyncERPal.model.SetupStatusResponse;
import com.yb.SyncERPal.service.AppUserService;
import com.yb.SyncERPal.service.AuthService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class AuthController {

    private final AuthService authService;
    private final AppUserService appUserService;

    public AuthController(
            AuthService authService,
            AppUserService appUserService
    ) {
        this.authService = authService;
        this.appUserService = appUserService;
    }

    @GetMapping("/auth/setup-required")
    public SetupStatusResponse getSetupStatus() {
        return new SetupStatusResponse(appUserService.isFirstUserSetupRequired());
    }

    @PostMapping("/auth/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/auth/me")
    public AuthenticatedUserResponse getCurrentUser(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        return authService.getCurrentUser(authorizationHeader);
    }

    @PostMapping("/auth/logout")
    public void logout(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        authService.logout(authorizationHeader);
    }
}