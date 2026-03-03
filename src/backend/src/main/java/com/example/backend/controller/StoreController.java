package com.example.backend.controller;

import com.example.backend.dto.CreateStoreRequest;
import com.example.backend.model.Store;
import com.example.backend.repository.StoreRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stores")
public class StoreController {

    private final StoreRepository storeRepository;

    public StoreController(StoreRepository storeRepository) {
        this.storeRepository = storeRepository;
    }

    @PostMapping
    public ResponseEntity<?> createStore(@RequestBody CreateStoreRequest request) {
        if (isBlank(request.getStoreName()) ||
                isBlank(request.getPhoneNumber()) ||
                isBlank(request.getAddress()) ||
                request.getLatitude() == null ||
                request.getLongitude() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "storeName, phoneNumber, address, latitude, and longitude are required"));
        }

        if (request.getLatitude() < -90 || request.getLatitude() > 90) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "latitude must be between -90 and 90"));
        }

        if (request.getLongitude() < -180 || request.getLongitude() > 180) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "longitude must be between -180 and 180"));
        }

        String generatedStoreId = generateNextStoreId();

        Store store = new Store(
                request.getStoreName().trim(),
            generatedStoreId,
                request.getPhoneNumber().trim(),
                request.getAddress().trim(),
                request.getLatitude(),
                request.getLongitude()
        );

        Store savedStore = storeRepository.save(store);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedStore);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String generateNextStoreId() {
        List<Store> stores = storeRepository.findAll();

        int maxNumber = stores.stream()
                .map(Store::getStoreId)
                .filter(this::isValidStoreCode)
                .mapToInt(code -> Integer.parseInt(code.substring(2)))
                .max()
                .orElse(0);

        return String.format("ST%03d", maxNumber + 1);
    }

    private boolean isValidStoreCode(String storeCode) {
        return storeCode != null && storeCode.matches("ST\\d{3,}");
    }
}