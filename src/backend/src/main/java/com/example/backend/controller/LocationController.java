package com.example.backend.controller;

import com.example.backend.dto.LocationRequest;
import com.example.backend.dto.LocationResponse;
import com.example.backend.service.LocationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    /**
     * POST /api/locations
     * Add a new location (STORE or GARMENT).
     * Only ADMIN or CHIEF_MANAGER may create locations.
     *
     * Body: { "name": "...", "latitude": 0.0, "longitude": 0.0,
     *         "type": "GARMENT", "contactInfo": "..." }
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CHIEF_MANAGER')")
    public ResponseEntity<LocationResponse> createLocation(
            @Valid @RequestBody LocationRequest request) {
        LocationResponse response = locationService.createLocation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/locations/garments
     * Retrieve all garment locations.
     */
    @GetMapping("/garments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<LocationResponse>> getAllGarments() {
        return ResponseEntity.ok(locationService.getAllGarments());
    }

    /**
     * GET /api/locations/stores
     * Retrieve all store locations.
     */
    @GetMapping("/stores")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<LocationResponse>> getAllStores() {
        return ResponseEntity.ok(locationService.getAllStores());
    }

    /**
     * GET /api/locations
     * Retrieve all locations (stores and garments).
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<LocationResponse>> getAllLocations() {
        return ResponseEntity.ok(locationService.getAllLocations());
    }

    /**
     * GET /api/locations/{id}
     * Retrieve a single location by ID.
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<LocationResponse> getLocationById(@PathVariable Long id) {
        return ResponseEntity.ok(locationService.getLocationById(id));
    }

    /**
     * PUT /api/locations/{id}
     * Update an existing location.
     * Only ADMIN or CHIEF_MANAGER may update locations.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CHIEF_MANAGER')")
    public ResponseEntity<LocationResponse> updateLocation(
            @PathVariable Long id,
            @Valid @RequestBody LocationRequest request) {
        return ResponseEntity.ok(locationService.updateLocation(id, request));
    }

    /**
     * DELETE /api/locations/{id}
     * Remove a location.
     * Only ADMIN may delete locations.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {
        locationService.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }
}
