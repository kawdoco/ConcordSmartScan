package com.example.backend.service;

import com.example.backend.model.Machine;
import com.example.backend.repository.MachineRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MachineService {

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
        return repository.save(machine);
    }

    public Machine updateMachine(Long id, Machine updatedMachine) {
        Machine machine = getMachineById(id);

        machine.setMachineId(updatedMachine.getMachineId());
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
}