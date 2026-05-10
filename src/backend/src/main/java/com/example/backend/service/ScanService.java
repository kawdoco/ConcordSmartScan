package com.example.backend.service;

import com.example.backend.dto.ScanMatchResponse;
import com.example.backend.model.Location;
import com.example.backend.model.LocationType;
import com.example.backend.model.Machine;
import com.example.backend.model.User;
import com.example.backend.repository.LocationRepository;
import com.example.backend.repository.MachineRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Handles the "scan a machine QR, find matching replacements at stores"
 * workflow, computing real distances from the technician's garment location.
 */
@Service
public class ScanService {

    private static final Pattern STO_PATTERN = Pattern.compile("(?i)^STO-?(\\d+)$");
    private static final double  EARTH_RADIUS_KM = 6371.0;

    private final MachineRepository  machineRepository;
    private final LocationRepository locationRepository;
    private final UserRepository     userRepository;

    public ScanService(MachineRepository machineRepository,
                       LocationRepository locationRepository,
                       UserRepository userRepository) {
        this.machineRepository  = machineRepository;
        this.locationRepository = locationRepository;
        this.userRepository     = userRepository;
    }

    /**
     * Given the scanned machine's code, find all other machines of the
     * same type AND model that are currently held at a store location.
     * Each result is enriched with the store's name/address/coordinates
     * and the distance (km) from the technician's garment.
     *
     * @param machineCode   the machineId value from the scanned QR (e.g. "MAC-003")
     * @param technicianId  id of the logged-in technician (used to look up their garment coords)
     */
    public List<ScanMatchResponse> findMatches(String machineCode, Long technicianId) {

        // 1. Resolve the scanned machine
        Machine scanned = machineRepository.findByMachineId(machineCode)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Machine not found: " + machineCode));

        // 2. Resolve technician's garment coordinates (best-effort)
        Double garmentLat = null;
        Double garmentLng = null;
        if (technicianId != null) {
            Optional<User> techOpt = userRepository.findById(technicianId);
            if (techOpt.isPresent()) {
                User tech = techOpt.get();
                // Prefer the linked Location entity (has real lat/lng)
                if (tech.getGarment() != null) {
                    garmentLat = tech.getGarment().getLatitude();
                    garmentLng = tech.getGarment().getLongitude();
                } else if (tech.getLocation() != null) {
                    // Fall back to parsing the location string "GAR-001" → lookup by name/id
                    garmentLat = resolveGarmentLatFromString(tech.getLocation(), "lat");
                    garmentLng = resolveGarmentLatFromString(tech.getLocation(), "lng");
                }
            }
        }

        final Double finalLat = garmentLat;
        final Double finalLng = garmentLng;

        // 3. Filter: same type + model, location starts with STO
        String scannedType  = normalise(scanned.getType());
        String scannedModel = normalise(scanned.getModel());

        List<Machine> candidates = machineRepository.findAll().stream()
                .filter(m -> !m.getMachineId().equalsIgnoreCase(scanned.getMachineId()))
                .filter(m -> normalise(m.getType()).equals(scannedType))
                .filter(m -> normalise(m.getModel()).equals(scannedModel))
                .filter(m -> isAtStore(m.getLocation()))
                .collect(Collectors.toList());

        // 4. Enrich with store details + distance
        List<ScanMatchResponse> results = candidates.stream()
                .map(m -> enrich(m, finalLat, finalLng))
                .sorted(Comparator.comparingDouble(r ->
                        r.getDistanceKm() != null ? r.getDistanceKm() : Double.MAX_VALUE))
                .collect(Collectors.toList());

        return results;
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    private ScanMatchResponse enrich(Machine m, Double fromLat, Double fromLng) {
        ScanMatchResponse dto = new ScanMatchResponse();
        dto.setId(m.getId());
        dto.setMachineId(m.getMachineId());
        dto.setType(m.getType());
        dto.setBrand(m.getBrand());
        dto.setModel(m.getModel());
        dto.setSerialNumber(m.getSerialNumber());
        dto.setLocation(m.getLocation());

        // Try to resolve the store from the locations table
        Long storeId = parseStoreNumber(m.getLocation());
        if (storeId != null) {
            Optional<Location> storeOpt = resolveStore(storeId, m.getLocation());
            if (storeOpt.isPresent()) {
                Location store = storeOpt.get();
                dto.setStoreLocationId(store.getLocationId());
                dto.setStoreName(store.getName());
                dto.setStoreAddress(store.getAddress());
                dto.setStoreLat(store.getLatitude());
                dto.setStoreLng(store.getLongitude());

                if (fromLat != null && fromLng != null
                        && store.getLatitude() != null && store.getLongitude() != null) {
                    dto.setDistanceKm(haversine(fromLat, fromLng,
                            store.getLatitude(), store.getLongitude()));
                }
            }
        }
        return dto;
    }

    /**
     * Attempt to find the store Location entity matching the machine's location string.
     * Strategy: first try by numeric ID, then fall back to name search.
     */
    private Optional<Location> resolveStore(Long storeNumber, String locationStr) {
        // Try direct id lookup
        Optional<Location> byId = locationRepository.findById(storeNumber);
        if (byId.isPresent() && byId.get().getType() == LocationType.STORE) {
            return byId;
        }
        // Fall back: find store whose name contains the number (e.g. "Store 1", "STO-001")
        String numStr = String.valueOf(storeNumber);
        return locationRepository.findByType(LocationType.STORE).stream()
                .filter(s -> s.getName() != null && s.getName().contains(numStr))
                .findFirst();
    }

    private boolean isAtStore(String location) {
        return location != null && location.trim().toUpperCase().startsWith("ST");
    }

    /** Extract trailing number from "STO-001" → 1L */
    private Long parseStoreNumber(String location) {
        if (location == null) return null;
        Matcher m = STO_PATTERN.matcher(location.trim());
        if (!m.find()) return null;
        try { return Long.parseLong(m.group(1)); } catch (NumberFormatException e) { return null; }
    }

    private String normalise(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }

    /** Haversine distance between two lat/lng points, result in km */
    private double haversine(double lat1, double lng1, double lat2, double lng2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    /**
     * Last-resort garment coord lookup from a plain "GAR-001" string.
     * Parses the trailing number and looks up the nth GARMENT location by id.
     */
    private Double resolveGarmentLatFromString(String locationStr, String field) {
        if (locationStr == null) return null;
        Pattern garPat = Pattern.compile("(?i)^GAR-?(\\d+)$");
        Matcher m = garPat.matcher(locationStr.trim());
        if (!m.find()) return null;
        try {
            long garId = Long.parseLong(m.group(1));
            Optional<Location> loc = locationRepository.findById(garId);
            if (loc.isPresent() && loc.get().getType() == LocationType.GARMENT) {
                return "lat".equals(field) ? loc.get().getLatitude() : loc.get().getLongitude();
            }
        } catch (NumberFormatException ignored) {}
        return null;
    }
}
