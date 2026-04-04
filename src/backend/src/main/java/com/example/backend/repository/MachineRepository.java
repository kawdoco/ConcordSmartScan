package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.model.Machine;

import java.util.Optional;

public interface MachineRepository extends JpaRepository<Machine, Long> {

	Optional<Machine> findByMachineCode(String machineCode);
}
