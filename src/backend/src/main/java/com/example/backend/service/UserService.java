package com.example.backend.service;

import com.example.backend.dto.AddUserRequest;
import com.example.backend.dto.UserResponse;
import com.example.backend.model.Location;
import com.example.backend.model.LocationType;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.LocationRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Pattern STRONG_PASSWORD_PATTERN =
            Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$");

    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       LocationRepository locationRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.locationRepository = locationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Create a new user.
     * Throws 409 if email already exists.
     * Role values accepted: TECHNICIAN, CHIEF_MANAGER, ADMIN (case-insensitive,
     * spaces converted to underscores). Defaults to TECHNICIAN if not provided.
     */
    public UserResponse addUser(AddUserRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }
        validatePasswordStrength(request.getPassword());

        String resolvedName = normalizeRequired(request.getName(), "Full name is required");
        Role role = parseRole(request.getRole(), Role.TECHNICIAN);

        User user = new User();
        user.setName(resolvedName);
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setLocation(resolveLocation(request));
        user.setDateOfBirth(request.getDateOfBirth());
        user.setPhoneNumber(normalizeNullable(request.getPhoneNumber()));
        user.setAddress(normalizeNullable(request.getAddress()));
        user.setCompanyEmail(normalizeNullableEmail(request.getCompanyEmail()));
        user.setGarment(resolveGarment(request.getGarmentId()));

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

        String newEmail = normalizeEmail(request.getEmail());
        if (!newEmail.equals(user.getEmail()) && userRepository.existsByEmail(newEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }

        user.setName(normalizeRequired(request.getName(), "Full name is required"));
        user.setEmail(newEmail);
        user.setLocation(resolveLocation(request));
        user.setDateOfBirth(request.getDateOfBirth());
        user.setPhoneNumber(normalizeNullable(request.getPhoneNumber()));
        user.setAddress(normalizeNullable(request.getAddress()));
        user.setCompanyEmail(normalizeNullableEmail(request.getCompanyEmail()));

        if (request.getRole() != null) {
            user.setRole(parseRole(request.getRole(), user.getRole()));
        }

        if (request.getGarmentId() != null) {
            user.setGarment(resolveGarment(request.getGarmentId()));
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            validatePasswordStrength(request.getPassword());
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
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());
        response.setUserType(user.getRole().name());
        response.setLocation(user.getLocation());
        response.setDateOfBirth(user.getDateOfBirth());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setAddress(user.getAddress());
        response.setCompanyEmail(user.getCompanyEmail());
        if (user.getGarment() != null) {
            response.setGarmentId(user.getGarment().getLocationId());
            response.setGarmentName(user.getGarment().getName());
        }
        return response;
    }

    private String normalizeRequired(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return value.trim();
    }

    private String normalizeEmail(String email) {
        return normalizeRequired(email, "Email is required").toLowerCase();
    }

    private String normalizeNullable(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String normalizeNullableEmail(String value) {
        String normalized = normalizeNullable(value);
        return normalized == null ? null : normalized.toLowerCase();
    }

    private String resolveLocation(AddUserRequest request) {
        String location = normalizeNullable(request.getLocation());
        if (location != null) return location;
        return normalizeNullable(request.getAddress());
    }

    private Location resolveGarment(Long garmentId) {
        if (garmentId == null) return null;

        Location garment = locationRepository.findById(garmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Garment not found"));

        if (garment.getType() != LocationType.GARMENT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Location is not a garment");
        }

        return garment;
    }

    private void validatePasswordStrength(String password) {
        if (!STRONG_PASSWORD_PATTERN.matcher(password).matches()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol"
            );
        }
    }
}
