package com.example.backend.repository;

import com.example.backend.model.MachineRequest;
import com.example.backend.model.RequestStatus;
import com.example.backend.model.RequestType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MachineRequestRepository extends JpaRepository<MachineRequest, Long> {

    List<MachineRequest> findByRequestTypeOrderByCreatedAtDesc(RequestType requestType);

    List<MachineRequest> findByRequestTypeAndStatusOrderByCreatedAtDesc(RequestType requestType, RequestStatus status);

    List<MachineRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);

    long countByRequestType(RequestType requestType);

    boolean existsByRequestCode(String requestCode);
}
