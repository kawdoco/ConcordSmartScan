package com.example.backend.repository;

import com.example.backend.model.Location;
import com.example.backend.model.LocationType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Long> {

    List<Location> findByType(LocationType type);

    boolean existsByNameAndType(String name, LocationType type);
}
