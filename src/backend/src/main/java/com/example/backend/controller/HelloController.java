package com.example.backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class HelloController {

    /** Public endpoint — accessible without a token (whitelisted in SecurityConfig) */
    @GetMapping("/hello")
    public String hello() {
        return "Hello from Spring Boot Backend!";
    }

    /** Protected endpoint — any authenticated user can access */
    @GetMapping("/profile")
    public String profile(@AuthenticationPrincipal UserDetails userDetails) {
        return "Hello, " + userDetails.getUsername() + "! Your role: " + userDetails.getAuthorities();
    }

    /** Admin-only endpoint */
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminOnly() {
        return "Welcome, Admin!";
    }

    /** Chief Manager-only endpoint */
    @GetMapping("/manager")
    @PreAuthorize("hasRole('CHIEF_MANAGER')")
    public String managerOnly() {
        return "Welcome, Chief Manager!";
    }

    /** Technician endpoint — accessible by TECHNICIAN, ADMIN, and CHIEF_MANAGER */
    @GetMapping("/technician")
    @PreAuthorize("hasAnyRole('TECHNICIAN', 'ADMIN', 'CHIEF_MANAGER')")
    public String technicianArea() {
        return "Welcome to the Technician area!";
    }
}

