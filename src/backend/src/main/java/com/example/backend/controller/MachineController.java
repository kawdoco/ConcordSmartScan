package com.example.backend.controller;

import com.example.backend.model.Machine;
import com.example.backend.repository.MachineRepository;
import com.example.backend.util.QRCodeGenerator;
import com.google.zxing.WriterException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/machines")
public class MachineController {

    @Autowired
    private MachineRepository machineRepository;

    @GetMapping
    public List<Machine> getAllMachines() {
        return machineRepository.findAll();
    }

    @PostMapping
    public Machine addMachine(@RequestBody Machine machine) throws IOException, WriterException {
        // Generate unique machine code
        machine.setMachineCode(UUID.randomUUID().toString());

        // Save machine
        Machine savedMachine = machineRepository.save(machine);

        // Generate QR
        String qrPath = "D:/qr_codes/" + savedMachine.getMachineCode() + ".png";
        QRCodeGenerator.generateQRCode(savedMachine.getMachineCode(), qrPath, 300, 300);

        return savedMachine;
    }
}