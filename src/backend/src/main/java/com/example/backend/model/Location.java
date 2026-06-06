package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "locations")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long locationId;

    @Column(nullable = false)
    private String name;

    private Double latitude;

    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LocationType type; // STORE | GARMENT

    private String contactInfo;

    private String address;

    public Location() {}

    public Location(String name, Double latitude, Double longitude,
                    LocationType type, String contactInfo) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.type = type;
        this.contactInfo = contactInfo;
    }

    public Location(String name, Double latitude, Double longitude,
                    LocationType type, String contactInfo, String address) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.type = type;
        this.contactInfo = contactInfo;
        this.address = address;
    }

    // Getters & Setters
    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }

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
