package com.example.backend.service;

import com.example.backend.dto.LocationRequest;
import com.example.backend.dto.LocationResponse;
import com.example.backend.model.Location;
import com.example.backend.model.LocationType;
import com.example.backend.repository.LocationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    /** Create a new location (STORE or GARMENT) */
    public LocationResponse createLocation(LocationRequest request) {
        if (locationRepository.existsByNameAndType(request.getName(), request.getType())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "A " + request.getType() + " with this name already exists");
        }

        Location location = new Location(
                request.getName(),
                request.getLatitude(),
                request.getLongitude(),
                request.getType(),
                request.getContactInfo()
        );

        return new LocationResponse(locationRepository.save(location));
    }

    /** Get all locations of type GARMENT */
    public List<LocationResponse> getAllGarments() {
        return locationRepository.findByType(LocationType.GARMENT)
                .stream()
                .map(LocationResponse::new)
                .collect(Collectors.toList());
    }

    // NOTE: Store management is handled by a separate implementation.
    // getAllStores() has been commented out to avoid conflicts.
    //
    /** Get all locations of type STORE */
     public List<LocationResponse> getAllStores() {
         return locationRepository.findByType(LocationType.STORE)
                 .stream()
                 .map(LocationResponse::new)
                 .collect(Collectors.toList());
     }

    /** Get all locations */
    public List<LocationResponse> getAllLocations() {
        return locationRepository.findAll()
                .stream()
                .map(LocationResponse::new)
                .collect(Collectors.toList());
    }

    /** Get a location by ID */
    public LocationResponse getLocationById(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Location not found with id: " + id));
        return new LocationResponse(location);
    }

    /** Update a location */
    public LocationResponse updateLocation(Long id, LocationRequest request) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Location not found with id: " + id));

        location.setName(request.getName());
        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setType(request.getType());
        location.setContactInfo(request.getContactInfo());

        return new LocationResponse(locationRepository.save(location));
    }

    /** Delete a location */
    public void deleteLocation(Long id) {
        if (!locationRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Location not found with id: " + id);
        }
        locationRepository.deleteById(id);
    }
}
