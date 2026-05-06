package com.example.backend.controller;

import com.example.backend.dto.ScanMatchResponse;
import com.example.backend.service.ScanService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Endpoints used by the QR scanner flow on the frontend.
 *
 * GET /api/scan/{machineCode}?technicianId={id}
 *   Returns machines of the same type + model that are at store locations,
 *   each enriched with the store details and distance from the technician's
 *   garment location.  Results are sorted nearest-first.
 */
@RestController
@RequestMapping("/api/scan")
@CrossOrigin(origins = "*")
public class ScanController {

    private final ScanService scanService;

    public ScanController(ScanService scanService) {
        this.scanService = scanService;
    }

    @GetMapping("/{machineCode}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ScanMatchResponse>> findMatches(
            @PathVariable String machineCode,
            @RequestParam(required = false) Long technicianId) {

        List<ScanMatchResponse> matches = scanService.findMatches(machineCode, technicianId);
        return ResponseEntity.ok(matches);
    }
}
