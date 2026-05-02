package com.example.backend.config;

import com.example.backend.model.*;
import com.example.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Arrays;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(
            UserRepository userRepository,
            MachineRepository machineRepository,
            LocationRepository locationRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            // 1. Seed Locations
            if (locationRepository.count() == 0) {
                locationRepository.saveAll(Arrays.asList(
                    new Location("Main Store", 6.9271, 79.8612, LocationType.STORE, "0112233445", "Colombo 01"),
                    new Location("Garment Plant A", 6.9319, 79.8478, LocationType.GARMENT, "0112233446", "Colombo 03"),
                    new Location("Garment Plant B", 7.2906, 80.6337, LocationType.GARMENT, "0812233447", "Kandy"),
                    new Location("Sub Store 01", 6.0535, 80.2210, LocationType.STORE, "0912233448", "Galle")
                ));
            }

            // 2. Seed Users
            createUserIfMissing(userRepository, passwordEncoder, "System Admin", "admin@concord.com", "Admin@123", Role.ADMIN, "Head Office");
            createUserIfMissing(userRepository, passwordEncoder, "Chief Manager", "chiefmanager@concord.com", "Chief@123", Role.CHIEF_MANAGER, "Head Office");
            createUserIfMissing(userRepository, passwordEncoder, "Technician", "technician@concord.com", "Tech@123", Role.TECHNICIAN, "Maintenance Unit");

            // 3. Seed Machines
            if (machineRepository.count() == 0) {
                machineRepository.saveAll(Arrays.asList(
                    createMachine("MCH-001", "Single Needle Lockstitch", "Juki", "DDL-8700", "SN123456", "Floor 1, Bay A"),
                    createMachine("MCH-002", "Overlock Machine", "Brother", "S-7100A", "SN123457", "Floor 2, Bay B"),
                    createMachine("MCH-003", "Buttonhole Machine", "Singer", "191D", "SN123458", "Floor 1, Bay C"),
                    createMachine("MCH-004", "Flatlock Machine", "Pegasus", "M900", "SN123459", "Floor 3, Bay A"),
                    createMachine("MCH-005", "Zig-Zag Stitcher", "Yamato", "VC2700", "SN123460", "Floor 2, Bay D")
                ));
            }
        };
    }

    private void createUserIfMissing(UserRepository userRepository, PasswordEncoder passwordEncoder, String name, String email, String rawPassword, Role role, String location) {
        if (!userRepository.existsByEmail(email)) {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setRole(role);
            user.setLocation(location);
            userRepository.save(user);
        }
    }

    private Machine createMachine(String machineId, String type, String brand, String model, String sn, String loc) {
        Machine m = new Machine();
        m.setMachineId(machineId);
        m.setType(type);
        m.setBrand(brand);
        m.setModel(model);
        m.setSerialNumber(sn);
        m.setLocation(loc);
        m.setDate(LocalDate.now());
        return m;
    }
}

