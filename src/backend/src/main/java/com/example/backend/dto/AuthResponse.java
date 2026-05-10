package com.example.backend.dto;

public class AuthResponse {
    private String token;
    private UserDto user;

    public AuthResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() { return token; }
    public UserDto getUser() { return user; }

    // ---- Inner DTO to avoid exposing the password ----
    public static class UserDto {
        private Long id;
        private String email;
        private String role;
        private Long garmentId;

        public UserDto(Long id, String email, String role, Long garmentId) {
            this.id       = id;
            this.email    = email;
            this.role     = role;
            this.garmentId = garmentId;
        }

        public Long getId()       { return id; }
        public String getEmail()  { return email; }
        public String getRole()   { return role; }
        public Long getGarmentId() { return garmentId; }
    }
}