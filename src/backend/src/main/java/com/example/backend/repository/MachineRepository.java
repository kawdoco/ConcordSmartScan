package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.model.Machine;

public interface MachineRepository extends JpaRepository<Machine, Long> {
}
