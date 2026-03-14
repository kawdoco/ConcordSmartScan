package com.example.backend.service;

import com.example.backend.dto.AddUserRequest;
import com.example.backend.dto.UserResponse;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Create a new user.
     * Throws 409 if email already exists.
     * Role values accepted: TECHNICIAN, CHIEF_MANAGER, ADMIN (case-insensitive,
     * spaces converted to underscores). Defaults to TECHNICIAN if not provided.
     */
    public UserResponse addUser(AddUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }

        Role role = parseRole(request.getRole(), Role.TECHNICIAN);

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setLocation(request.getLocation() != null ? request.getLocation().trim() : null);

        return toResponse(userRepository.save(user));
    }

    /** Retrieve all users. */
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /** Retrieve a single user by ID. */
    public UserResponse getUserById(Long id) {
        return toResponse(findOrThrow(id));
    }

    /**
     * Update name, email, role, location (and optionally password) of an existing user.
     * Throws 404 if user not found.
     * Throws 409 if the new email is already taken by another user.
     */
    public UserResponse updateUser(Long id, AddUserRequest request) {
        User user = findOrThrow(id);

        String newEmail = request.getEmail().trim().toLowerCase();
        if (!newEmail.equals(user.getEmail()) && userRepository.existsByEmail(newEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }

        user.setName(request.getName().trim());
        user.setEmail(newEmail);
        user.setLocation(request.getLocation() != null ? request.getLocation().trim() : null);

        if (request.getRole() != null) {
            user.setRole(parseRole(request.getRole(), user.getRole()));
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return toResponse(userRepository.save(user));
    }

    /** Delete a user by ID. Throws 404 if not found. */
    public void deleteUser(Long id) {
        findOrThrow(id);
        userRepository.deleteById(id);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private User findOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    /**
     * Parse a role string to the Role enum.
     * Accepts values like "Technician", "Chief Manager", "CHIEF_MANAGER", etc.
     */
    private Role parseRole(String roleStr, Role defaultRole) {
        if (roleStr == null || roleStr.isBlank()) return defaultRole;
        try {
            return Role.valueOf(roleStr.trim().toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role: " + roleStr);
        }
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getLocation()
        );
    }
}
