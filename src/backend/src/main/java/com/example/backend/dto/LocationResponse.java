package com.example.backend.dto;

import com.example.backend.model.Location;
import com.example.backend.model.LocationType;

public class LocationResponse {

    private Long locationId;
    private String name;
    private Double latitude;
    private Double longitude;
    private LocationType type;
    private String contactInfo;

    public LocationResponse() {}

    public LocationResponse(Location location) {
        this.locationId  = location.getLocationId();
        this.name        = location.getName();
        this.latitude    = location.getLatitude();
        this.longitude   = location.getLongitude();
        this.type        = location.getType();
        this.contactInfo = location.getContactInfo();
    }

    // Getters
    public Long getLocationId() { return locationId; }
    public String getName() { return name; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public LocationType getType() { return type; }
    public String getContactInfo() { return contactInfo; }
}
