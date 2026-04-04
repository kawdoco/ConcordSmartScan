package com.example.backend.config;

import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDefaultAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            createUserIfMissing(
                    userRepository,
                    passwordEncoder,
                    "System Admin",
                    "admin@concord.com",
                    "Admin@123",
                    Role.ADMIN,
                    "Head Office"
            );

            createUserIfMissing(
                    userRepository,
                    passwordEncoder,
                    "Chief Manager",
                    "chiefmanager@concord.com",
                    "Chief@123",
                    Role.CHIEF_MANAGER,
                    "Head Office"
            );

            createUserIfMissing(
                    userRepository,
                    passwordEncoder,
                    "Technician",
                    "technician@concord.com",
                    "Tech@123",
                    Role.TECHNICIAN,
                    "Maintenance Unit"
            );
        };
    }

    private void createUserIfMissing(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            String name,
            String email,
            String rawPassword,
            Role role,
            String location
    ) {
        if (userRepository.existsByEmail(email)) {
            return;
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(role);
        user.setLocation(location);
        userRepository.save(user);
    }
}
