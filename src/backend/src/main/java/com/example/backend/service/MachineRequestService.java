package com.example.backend.service;

import com.example.backend.dto.CreateMachineRequestDto;
import com.example.backend.dto.MachineRequestResponse;
import com.example.backend.model.Machine;
import com.example.backend.model.MachineRequest;
import com.example.backend.model.RequestStatus;
import com.example.backend.model.RequestType;
import com.example.backend.repository.MachineRepository;
import com.example.backend.repository.MachineRequestRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class MachineRequestService {

    private final MachineRequestRepository machineRequestRepository;
    private final MachineRepository machineRepository;

    public MachineRequestService(MachineRequestRepository machineRequestRepository,
                                 MachineRepository machineRepository) {
        this.machineRequestRepository = machineRequestRepository;
        this.machineRepository = machineRepository;
    }

    public MachineRequestResponse createRequest(CreateMachineRequestDto dto) {
        RequestType requestType = parseRequestType(dto.getRequestType());

        MachineRequest request = new MachineRequest();
        request.setRequestCode(generateRequestCode(requestType));
        request.setRequestType(requestType);
        request.setToGarmentId(normalizeRequired(dto.getToGarmentId(), "To Garment ID is required"));
        request.setPriority(resolvePriority(dto.getPriority()));
        request.setReason(normalizeRequired(dto.getReason(), "Reason is required"));
        request.setRequiredDate(dto.getRequiredDate());
        request.setNotes(normalizeOptional(dto.getNotes()));
        request.setStatus(RequestStatus.PENDING);

        if (requestType == RequestType.TRANSFER) {
            String fromStoreId = normalizeOptional(dto.getFromStoreId());
            String machineId = normalizeRequired(dto.getMachineId(), "Machine ID is required for transfer requests");
            Machine machine = findMachineByFlexibleMachineId(machineId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Machine not found for ID: " + machineId));

                request.setMachineId(formatMachineDisplayId(machine));
            request.setMachineType(normalizeOptional(machine.getBrand()));
            request.setFromStoreId(fromStoreId != null ? fromStoreId : normalizeOptional(machine.getLocation()));
        } else {
            request.setMachineId(normalizeOptional(dto.getMachineId()));
            request.setMachineType(normalizeRequired(dto.getMachineType(), "Machine type is required for purchase requests"));
            request.setFromStoreId(null);
        }

        MachineRequest saved = machineRequestRepository.save(request);
        return new MachineRequestResponse(saved);
    }

    public List<MachineRequestResponse> getRequests(String type, String status) {
        List<MachineRequest> requests;
        RequestType requestType = parseNullableRequestType(type);
        RequestStatus requestStatus = parseNullableRequestStatus(status);

        if (requestType != null && requestStatus != null) {
            requests = machineRequestRepository.findByRequestTypeAndStatusOrderByCreatedAtDesc(requestType, requestStatus);
        } else if (requestType != null) {
            requests = machineRequestRepository.findByRequestTypeOrderByCreatedAtDesc(requestType);
        } else if (requestStatus != null) {
            requests = machineRequestRepository.findByStatusOrderByCreatedAtDesc(requestStatus);
        } else {
            requests = machineRequestRepository.findAll();
            requests.sort((left, right) -> right.getCreatedAt().compareTo(left.getCreatedAt()));
        }

        return requests.stream().map(MachineRequestResponse::new).toList();
    }

    public MachineRequestResponse updateStatus(Long id, String status) {
        MachineRequest request = machineRequestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));

        request.setStatus(parseRequestStatus(status));
        return new MachineRequestResponse(machineRequestRepository.save(request));
    }

    private RequestType parseRequestType(String value) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request type is required");
        }

        try {
            return RequestType.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid request type: " + value);
        }
    }

    private RequestType parseNullableRequestType(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return parseRequestType(value);
    }

    private RequestStatus parseNullableRequestStatus(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        try {
            return RequestStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status: " + value);
        }
    }

    private RequestStatus parseRequestStatus(String value) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status is required");
        }

        try {
            RequestStatus parsed = RequestStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
            if (parsed == RequestStatus.PENDING) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status update only supports APPROVED or DECLINED");
            }
            return parsed;
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status: " + value);
        }
    }

    private String generateRequestCode(RequestType type) {
        String prefix = type == RequestType.TRANSFER ? "TR" : "PUR";
        long nextNumber = machineRequestRepository.countByRequestType(type) + 1;

        String code = formatCode(prefix, nextNumber);
        while (machineRequestRepository.existsByRequestCode(code)) {
            nextNumber++;
            code = formatCode(prefix, nextNumber);
        }

        return code;
    }

    private String formatCode(String prefix, long number) {
        return prefix + "-" + String.format(Locale.ROOT, "%04d", number);
    }

    private String formatMachineDisplayId(Machine machine) {
        if (machine == null || machine.getId() == null) {
            return normalizeOptional(machine != null ? machine.getMachineCode() : null);
        }
        return "MAC-" + String.format(Locale.ROOT, "%03d", machine.getId());
    }

    private String normalizeRequired(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return value.trim();
    }

    private String normalizeOptional(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String resolvePriority(String value) {
        String normalized = normalizeOptional(value);
        return normalized == null ? "medium" : normalized.toLowerCase(Locale.ROOT);
    }

    private Optional<Machine> findMachineByFlexibleMachineId(String inputMachineId) {
        String trimmed = inputMachineId.trim();
        Optional<Machine> directMatch = machineRepository.findByMachineId(trimmed);
        if (directMatch.isPresent()) {
            return directMatch;
        }

        String normalized = trimmed.toUpperCase(Locale.ROOT);
        if (normalized.startsWith("MAC-")) {
            normalized = normalized.substring(4);
        }

        normalized = normalized.replaceFirst("^0+(?!$)", "");
        if (normalized.isBlank()) {
            normalized = "0";
        }

        Optional<Machine> plainMatch = machineRepository.findByMachineId(normalized);
        if (plainMatch.isPresent()) {
            return plainMatch;
        }

        if (!normalized.matches("\\d+")) {
            return Optional.empty();
        }

        try {
            Optional<Machine> idMatch = machineRepository.findById(Long.parseLong(normalized));
            if (idMatch.isPresent()) {
                return idMatch;
            }
        } catch (NumberFormatException ignored) {
            // Keep flowing to padded machineId lookup.
        }

        String padded = String.format(Locale.ROOT, "%03d", Integer.parseInt(normalized));
        return machineRepository.findByMachineId(padded);
    }
}
