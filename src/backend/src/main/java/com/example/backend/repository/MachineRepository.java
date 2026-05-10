package com.example.backend.repository;

import com.example.backend.model.Machine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MachineRepository extends JpaRepository<Machine, Long> {
	java.util.Optional<Machine> findByMachineId(String machineId);
}