package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public class AddUserRequest {

    @NotBlank(message = "Full name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    // Optional for update; required for create in service validation.
    private String password;

    // Required on update only when changing password.
    private String currentPassword;

    // TECHNICIAN | CHIEF_MANAGER | ADMIN — defaults to TECHNICIAN if omitted
    @JsonAlias("userType")
    private String role;

    private String location;

    private LocalDate dateOfBirth;

    @Pattern(regexp = "^[+0-9()\\-\\s]{7,20}$", message = "Invalid phone number format")
    private String phoneNumber;

    private String address;

    @Email(message = "Invalid company email format")
    private String companyEmail;

    private Long garmentId;

    public AddUserRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getCurrentPassword() { return currentPassword; }
    public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCompanyEmail() { return companyEmail; }
    public void setCompanyEmail(String companyEmail) { this.companyEmail = companyEmail; }

    public Long getGarmentId() { return garmentId; }
    public void setGarmentId(Long garmentId) { this.garmentId = garmentId; }
}
