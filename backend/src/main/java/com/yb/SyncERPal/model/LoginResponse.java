package com.yb.SyncERPal.model;

public class LoginResponse {

    private Long userId;
    private String username;
    private UserRole role;

    public LoginResponse(Long userId, String username, UserRole role) {
        this.userId = userId;
        this.username = username;
        this.role = role;
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
}