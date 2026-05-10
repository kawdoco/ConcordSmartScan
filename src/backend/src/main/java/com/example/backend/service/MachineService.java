package com.example.backend.service;

import com.example.backend.model.Machine;
import com.example.backend.repository.MachineRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
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
        return repository.findAll().stream()
            .map(this::normalizeMachineIdForRead)
            .toList();
    }

    public Machine getMachineById(Long id) {
        Machine machine = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Machine not found with id: " + id));

        return normalizeMachineIdForRead(machine);
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
        machine.setMachineId(resolveCanonicalMachineId(machine.getMachineId(), machine.getId()));

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
        return String.format(Locale.ROOT, "MAC-%03d", value);
    }

    private Machine normalizeMachineIdForRead(Machine machine) {
        String canonical = resolveCanonicalMachineId(machine.getMachineId(), machine.getId());
        if (canonical != null && !canonical.equals(machine.getMachineId())) {
            machine.setMachineId(canonical);
            return repository.save(machine);
        }
        return machine;
    }

    private String resolveCanonicalMachineId(String rawMachineId, Long fallbackId) {
        int extracted = extractTrailingNumber(rawMachineId);

        if (extracted <= 0 && fallbackId != null && fallbackId > 0) {
            extracted = fallbackId.intValue();
        }

        if (extracted <= 0) {
            return null;
        }

        return formatMachineId(extracted);
    }
}