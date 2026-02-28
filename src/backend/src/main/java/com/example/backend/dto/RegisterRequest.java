package com.example.backend.dto;

public class RegisterRequest {
    private String email;
    private String password;
    private String role; // ADMIN | TECHNICIAN | CHIEF_MANAGER  (defaults to TECHNICIAN)

    public RegisterRequest() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
