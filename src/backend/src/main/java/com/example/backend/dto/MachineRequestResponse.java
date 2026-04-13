package com.example.backend.dto;

import com.example.backend.model.MachineRequest;
import com.example.backend.model.RequestStatus;
import com.example.backend.model.RequestType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class MachineRequestResponse {

    private Long id;
    private String requestCode;
    private RequestType requestType;
    private String machineId;
    private String machineType;
    private String fromStoreId;
    private String toGarmentId;
    private String priority;
    private String reason;
    private LocalDate requiredDate;
    private String notes;
    private RequestStatus status;
    private Long approvedByManagerId;
    private LocalDateTime createdAt;

    public MachineRequestResponse() {
    }

    public MachineRequestResponse(MachineRequest request) {
        this.id = request.getId();
        this.requestCode = request.getRequestCode();
        this.requestType = request.getRequestType();
        this.machineId = request.getMachineId();
        this.machineType = request.getMachineType();
        this.fromStoreId = request.getFromStoreId();
        this.toGarmentId = request.getToGarmentId();
        this.priority = request.getPriority();
        this.reason = request.getReason();
        this.requiredDate = request.getRequiredDate();
        this.notes = request.getNotes();
        this.status = request.getStatus();
        this.approvedByManagerId = request.getApprovedByManagerId();
        this.createdAt = request.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public String getRequestCode() {
        return requestCode;
    }

    public RequestType getRequestType() {
        return requestType;
    }

    public String getMachineId() {
        return machineId;
    }

    public String getMachineType() {
        return machineType;
    }

    public String getFromStoreId() {
        return fromStoreId;
    }

    public String getToGarmentId() {
        return toGarmentId;
    }

    public String getPriority() {
        return priority;
    }

    public String getReason() {
        return reason;
    }

    public LocalDate getRequiredDate() {
        return requiredDate;
    }

    public String getNotes() {
        return notes;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public Long getApprovedByManagerId() {
        return approvedByManagerId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
