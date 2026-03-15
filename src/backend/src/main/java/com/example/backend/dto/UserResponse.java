package com.example.backend.dto;

public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private String location;

    public UserResponse() {}

    public UserResponse(Long id, String name, String email, String role, String location) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.location = location;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
