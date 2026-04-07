// package com.example.backend.controller;

// import com.example.backend.model.Machine;
// import com.example.backend.repository.MachineRepository;
// import com.example.backend.util.QRCodeGenerator;
// import com.google.zxing.WriterException;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;

// import java.io.IOException;
// import java.util.List;
// import java.util.UUID;

// @RestController
// @RequestMapping("/api/machines")
// public class MachineController {

//     @Autowired
//     private MachineRepository machineRepository;

//     @GetMapping
//     public List<Machine> getAllMachines() {
//         return machineRepository.findAll();
//     }

//     @PostMapping
//     public Machine addMachine(@RequestBody Machine machine) throws IOException, WriterException {
//         // Generate unique machine code
//         machine.setMachineCode(UUID.randomUUID().toString());

//         // Save machine
//         Machine savedMachine = machineRepository.save(machine);

//         // Generate QR
//         String qrPath = "D:/qr_codes/" + savedMachine.getMachineCode() + ".png";
//         QRCodeGenerator.generateQRCode(savedMachine.getMachineCode(), qrPath, 300, 300);

//         return savedMachine;
//     }
// }


package com.example.backend.controller;

import com.example.backend.model.Machine;
import com.example.backend.service.MachineService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/machines")
@CrossOrigin(origins = "*")
public class MachineController {

    private final MachineService service;

    public MachineController(MachineService service) {
        this.service = service;
    }

    @GetMapping
    public List<Machine> getAllMachines() {
        return service.getAllMachines();
    }

    @GetMapping("/{id}")
    public Machine getMachineById(@PathVariable Long id) {
        return service.getMachineById(id);
    }

    @PostMapping
    public Machine createMachine(@RequestBody Machine machine) {
        return service.createMachine(machine);
    }

    @PutMapping("/{id}")
    public Machine updateMachine(@PathVariable Long id, @RequestBody Machine machine) {
        return service.updateMachine(id, machine);
    }

    @DeleteMapping("/{id}")
    public String deleteMachine(@PathVariable Long id) {
        service.deleteMachine(id);
        return "Machine deleted successfully!";
    }
}