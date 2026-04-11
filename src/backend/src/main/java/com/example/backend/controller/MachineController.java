package com.example.backend.controller;

import com.example.backend.model.Machine;
import com.example.backend.repository.MachineRepository;
import com.example.backend.util.QRCodeGenerator;
import com.google.zxing.WriterException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/machines")
@CrossOrigin(origins = "*")
public class MachineController {

    @Autowired
    private MachineRepository machineRepository;

    @GetMapping
    public List<Machine> getAllMachines(@RequestParam(required = false) String search) {
        return machineRepository.findAll().stream()
                .filter(machine -> matchesSearch(machine, search))
                .collect(Collectors.toList());
    }

    @GetMapping("/code/{machineCode}")
    public ResponseEntity<Machine> getMachineByCode(@PathVariable String machineCode) {
        return machineRepository.findByMachineCode(machineCode)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public Machine addMachine(@RequestBody Machine machine) throws IOException, WriterException {
        // Generate unique machine code
        machine.setMachineCode(UUID.randomUUID().toString());
        if (machine.getAddedDate() == null) {
            machine.setAddedDate(LocalDate.now());
        }

        // Save machine
        Machine savedMachine = machineRepository.save(machine);

        // Generate QR
        String qrPath = "D:/qr_codes/" + savedMachine.getMachineCode() + ".png";
        QRCodeGenerator.generateQRCode(savedMachine.getMachineCode(), qrPath, 300, 300);

        return savedMachine;
    }

    private boolean matchesSearch(Machine machine, String search) {
        String query = normalizeSearch(search);
        if (query.isEmpty()) {
            return true;
        }

        return containsIgnoreCase(String.valueOf(machine.getId()), query)
                || containsIgnoreCase(machine.getMachineCode(), query)
                || containsIgnoreCase(machine.getName(), query)
                || containsIgnoreCase(machine.getLocation(), query)
                || containsIgnoreCase(machine.getAddedDate() == null ? null : machine.getAddedDate().toString(), query);
    }

    private String normalizeSearch(String search) {
        return search == null ? "" : search.trim().toLowerCase();
    }

    private boolean containsIgnoreCase(String value, String query) {
        return value != null && value.toLowerCase().contains(query);
    }
}