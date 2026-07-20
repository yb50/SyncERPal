package com.yb.SyncERPal.service;

import com.yb.SyncERPal.model.InventoryLocation;
import com.yb.SyncERPal.repository.InventoryLocationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryLocationService {

    private final InventoryLocationRepository inventoryLocationRepository;
    private final AppUserService appUserService;
    private final AuditLogService auditLogService;

    public InventoryLocationService(
            InventoryLocationRepository inventoryLocationRepository,
            AppUserService appUserService,
            AuditLogService auditLogService
    ) {
        this.inventoryLocationRepository = inventoryLocationRepository;
        this.appUserService = appUserService;
        this.auditLogService = auditLogService;
    }

    public List<InventoryLocation> getAllLocations() {
        return inventoryLocationRepository.findAll();
    }

    public InventoryLocation createLocation(InventoryLocation inventoryLocation, String performedBy) {
        appUserService.requireManagerOrAdmin(performedBy);

        validateLocation(inventoryLocation);

        if (inventoryLocationRepository.existsByCode(inventoryLocation.getCode())) {
            throw new IllegalArgumentException("Location code already exists.");
        }

        InventoryLocation savedLocation = inventoryLocationRepository.save(inventoryLocation);

        auditLogService.createAuditLog(
                "CREATE_LOCATION",
                "LOCATION",
                savedLocation.getId(),
                "Created location: " + savedLocation.getCode(),
                performedBy
        );

        return savedLocation;
    }

    private void validateLocation(InventoryLocation inventoryLocation) {
        if (inventoryLocation.getCode() == null || inventoryLocation.getCode().isBlank()) {
            throw new IllegalArgumentException("Location code is required.");
        }

        if (inventoryLocation.getName() == null || inventoryLocation.getName().isBlank()) {
            throw new IllegalArgumentException("Location name is required.");
        }
    }
}