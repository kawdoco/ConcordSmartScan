package com.example.backend.dto;

import com.example.backend.model.LocationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class LocationRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private Double latitude;

    private Double longitude;

    @NotNull(message = "Type is required (STORE or GARMENT)")
    private LocationType type;

    private String contactInfo;

    private String address;

    public LocationRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public LocationType getType() { return type; }
    public void setType(LocationType type) { this.type = type; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
