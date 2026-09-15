package com.yb.SyncERPal.model;

public class LoginResponse {

    private Long userId;
    private String username;
    private UserRole role;
    private String token;

    public LoginResponse(Long userId, String username, UserRole role, String token) {
        this.userId = userId;
        this.username = username;
        this.role = role;
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public UserRole getRole() {
        return role;
    }

    public String getToken() {
        return token;
    }
}