package com.example.backend.controller;

import com.example.backend.dto.AddUserRequest;
import com.example.backend.dto.UserResponse;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * POST /api/users
     * Add a new user to the system.
     * Body: { "name": "...", "email": "...", "password": "...", "role": "TECHNICIAN", "location": "..." }
     */
    @PostMapping
    public ResponseEntity<UserResponse> addUser(@Valid @RequestBody AddUserRequest request) {
        UserResponse response = userService.addUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/users
     * Retrieve all users.
     */
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(userService.getAllUsers(search));
    }

    /**
     * GET /api/users/{id}
     * Retrieve a single user by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    /**
     * PUT /api/users/{id}
     * Update an existing user's details.
     * Body: { "name": "...", "email": "...", "role": "...", "location": "..." }
     * Password is optional — omit or leave blank to keep existing password.
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody AddUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    /**
     * DELETE /api/users/{id}
     * Delete a user by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}

