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
import com.example.backend.repository.MachineRepository;
import com.example.backend.service.MachineService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/machines")
@CrossOrigin(origins = "*")
public class MachineController {

    private final MachineService service;
    private final MachineRepository machineRepository;

    public MachineController(MachineService service, MachineRepository machineRepository) {
        this.service = service;
        this.machineRepository = machineRepository;
    }

    @GetMapping
    public List<Machine> getAllMachines(@RequestParam(required = false) String search) {
        return service.getAllMachines().stream()
                .filter(machine -> matchesSearch(machine, search))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Machine> getMachineById(@PathVariable Long id) {
        try {
            Machine machine = service.getMachineById(id);
            return ResponseEntity.ok(machine);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/code/{machineCode}")
    public ResponseEntity<Machine> getMachineByCode(@PathVariable String machineCode) {
        return machineRepository.findByMachineId(machineCode)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
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

    private boolean matchesSearch(Machine machine, String search) {
        String query = normalizeSearch(search);
        if (query.isEmpty()) {
            return true;
        }

        return containsIgnoreCase(String.valueOf(machine.getId()), query)
                || containsIgnoreCase(machine.getMachineCode(), query)
                || containsIgnoreCase(machine.getType(), query)
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