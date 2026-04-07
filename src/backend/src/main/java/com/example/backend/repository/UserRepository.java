package com.example.backend.repository;

import com.example.backend.model.User;
import com.example.backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findFirstByRoleAndGarment_LocationIdOrderByIdAsc(Role role, Long locationId);
    Optional<User> findFirstByRoleAndLocationIgnoreCaseOrderByIdAsc(Role role, String location);
    Optional<User> findFirstByRoleOrderByIdAsc(Role role);
}
