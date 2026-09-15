package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.AuthenticatedUserResponse;
import com.yb.SyncERPal.model.LoginRequest;
import com.yb.SyncERPal.model.LoginResponse;
import com.yb.SyncERPal.service.AuthService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
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
}