package com.example.backend.controller;

import com.example.backend.dto.CreateMachineRequestDto;
import com.example.backend.dto.MachineRequestResponse;
import com.example.backend.dto.UpdateRequestStatusDto;
import com.example.backend.service.MachineRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class MachineRequestController {

    private final MachineRequestService machineRequestService;

    public MachineRequestController(MachineRequestService machineRequestService) {
        this.machineRequestService = machineRequestService;
    }

    @PostMapping
    public ResponseEntity<MachineRequestResponse> createRequest(@Valid @RequestBody CreateMachineRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(machineRequestService.createRequest(request));
    }

    @GetMapping
    public ResponseEntity<List<MachineRequestResponse>> getRequests(@RequestParam(required = false) String type,
                                                                    @RequestParam(required = false) String status) {
        return ResponseEntity.ok(machineRequestService.getRequests(type, status));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<MachineRequestResponse> updateStatus(@PathVariable Long id,
                                                               @Valid @RequestBody UpdateRequestStatusDto request) {
        return ResponseEntity.ok(machineRequestService.updateStatus(id, request.getStatus()));
    }
}
