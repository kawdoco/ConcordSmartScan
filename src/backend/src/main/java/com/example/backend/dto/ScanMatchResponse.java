package com.example.backend.dto;

/**
 * Returned by GET /api/machines/scan/{machineCode}
 * Represents a matching replacement machine (same type + model, at a store)
 * enriched with its store's coordinates and the distance from the
 * technician's garment location.
 */
public class ScanMatchResponse {

    private Long   id;
    private String machineId;        // e.g. "MAC-003"
    private String type;
    private String brand;
    private String model;
    private String serialNumber;
    private String location;         // e.g. "STO-001"

    // Store details (from locations table)
    private Long   storeLocationId;
    private String storeName;
    private String storeAddress;
    private Double storeLat;
    private Double storeLng;

    // Distance in km from technician's garment to this store (null if coords missing)
    private Double distanceKm;

    public ScanMatchResponse() {}

    // ── Getters & Setters ──────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMachineId() { return machineId; }
    public void setMachineId(String machineId) { this.machineId = machineId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Long getStoreLocationId() { return storeLocationId; }
    public void setStoreLocationId(Long storeLocationId) { this.storeLocationId = storeLocationId; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getStoreAddress() { return storeAddress; }
    public void setStoreAddress(String storeAddress) { this.storeAddress = storeAddress; }

    public Double getStoreLat() { return storeLat; }
    public void setStoreLat(Double storeLat) { this.storeLat = storeLat; }

    public Double getStoreLng() { return storeLng; }
    public void setStoreLng(Double storeLng) { this.storeLng = storeLng; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
}
