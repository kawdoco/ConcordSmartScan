package com.example.backend.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
public class Machine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String machineCode;

    private String name;
    private String location;

    @Column(name = "added_date")
    private LocalDate addedDate;

    public Machine() {}

    public Machine(String name, String location) {
        this.name = name;
        this.location = location;
        this.machineCode = UUID.randomUUID().toString();
    }

    @PrePersist
    public void generateCode() {
        if (machineCode == null) {
            machineCode = UUID.randomUUID().toString();
        }
        if (addedDate == null) {
            addedDate = LocalDate.now();
        }
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setMachineCode(String machineCode) {
        this.machineCode = machineCode;
    }

    public String getMachineCode() {
        return this.machineCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDate getAddedDate() {
        return addedDate;
    }

    public void setAddedDate(LocalDate addedDate) {
        this.addedDate = addedDate;
    }
}