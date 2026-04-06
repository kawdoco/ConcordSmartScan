package com.example.backend.service;

import com.example.backend.model.Machine;
import com.example.backend.repository.MachineRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class MachineService {

    private static final Pattern TRAILING_DIGITS = Pattern.compile("(\\d+)$");

    private final MachineRepository repository;

    public MachineService(MachineRepository repository) {
        this.repository = repository;
    }

    public List<Machine> getAllMachines() {
        return repository.findAll();
    }

    public Machine getMachineById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Machine not found with id: " + id));
    }

    public Machine createMachine(Machine machine) {
        machine.setMachineId(generateNextMachineId());
        return repository.save(machine);
    }

    public Machine updateMachine(Long id, Machine updatedMachine) {
        Machine machine = getMachineById(id);

        machine.setType(updatedMachine.getType());
        machine.setBrand(updatedMachine.getBrand());
        machine.setModel(updatedMachine.getModel());
        machine.setSerialNumber(updatedMachine.getSerialNumber());
        machine.setLocation(updatedMachine.getLocation());
        machine.setDate(updatedMachine.getDate());

        return repository.save(machine);
    }

    public void deleteMachine(Long id) {
        repository.deleteById(id);
    }

    private synchronized String generateNextMachineId() {
        int maxUsedNumber = repository.findAll().stream()
                .map(Machine::getMachineId)
                .mapToInt(this::extractTrailingNumber)
                .max()
                .orElse(0);

        int nextNumber = maxUsedNumber + 1;
        String candidate = formatMachineId(nextNumber);

        while (repository.findByMachineId(candidate).isPresent()) {
            nextNumber++;
            candidate = formatMachineId(nextNumber);
        }

        return candidate;
    }

    private int extractTrailingNumber(String value) {
        if (value == null || value.isBlank()) {
            return 0;
        }

        Matcher matcher = TRAILING_DIGITS.matcher(value.trim());
        if (!matcher.find()) {
            return 0;
        }

        try {
            return Integer.parseInt(matcher.group(1));
        } catch (NumberFormatException ex) {
            return 0;
        }
    }

    private String formatMachineId(int value) {
        return String.format("%03d", value);
    }
}