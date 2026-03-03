package com.example.backend.repository;

import com.example.backend.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreRepository extends JpaRepository<Store, Long> {
    boolean existsByStoreId(String storeId);
}