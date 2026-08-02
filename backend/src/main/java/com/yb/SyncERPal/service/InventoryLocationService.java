package com.yb.SyncERPal.service;

import com.yb.SyncERPal.model.InventoryLocation;
import com.yb.SyncERPal.repository.InventoryBalanceRepository;
import com.yb.SyncERPal.repository.InventoryLocationRepository;
import com.yb.SyncERPal.repository.StockMovementRepository;
import com.yb.SyncERPal.repository.StockTransferRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryLocationService {

    private final InventoryLocationRepository inventoryLocationRepository;
    private final AppUserService appUserService;
    private final AuditLogService auditLogService;
    private final InventoryBalanceRepository inventoryBalanceRepository;
    private final StockMovementRepository stockMovementRepository;
    private final StockTransferRepository stockTransferRepository;

    public InventoryLocationService(
            InventoryLocationRepository inventoryLocationRepository,
            AppUserService appUserService,
            AuditLogService auditLogService,
            InventoryBalanceRepository inventoryBalanceRepository,
            StockMovementRepository stockMovementRepository,
            StockTransferRepository stockTransferRepository
    ) {
        this.inventoryLocationRepository = inventoryLocationRepository;
        this.appUserService = appUserService;
        this.auditLogService = auditLogService;
        this.inventoryBalanceRepository = inventoryBalanceRepository;
        this.stockMovementRepository = stockMovementRepository;
        this.stockTransferRepository = stockTransferRepository;
    }

    private void validateLocation(InventoryLocation inventoryLocation) {
        if (inventoryLocation.getCode() == null || inventoryLocation.getCode().isBlank()) {
            throw new IllegalArgumentException("Location code is required.");
        }

        if (inventoryLocation.getName() == null || inventoryLocation.getName().isBlank()) {
            throw new IllegalArgumentException("Location name is required.");
        }
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

    public InventoryLocation updateLocation(
            Long id,
            InventoryLocation inventoryLocation,
            String performedBy
    ) {
        appUserService.requireManagerOrAdmin(performedBy);

        validateLocation(inventoryLocation);

        InventoryLocation existingLocation = inventoryLocationRepository.findById(id);

        if (existingLocation == null) {
            return null;
        }

        boolean codeChanged = !existingLocation.getCode().equals(inventoryLocation.getCode());

        if (codeChanged && inventoryLocationRepository.existsByCode(inventoryLocation.getCode())) {
            throw new IllegalArgumentException("Location code already exists.");
        }

        String oldCode = existingLocation.getCode();
        String oldName = existingLocation.getName();

        existingLocation.setCode(inventoryLocation.getCode());
        existingLocation.setName(inventoryLocation.getName());

        InventoryLocation updatedLocation = inventoryLocationRepository.save(existingLocation);

        auditLogService.createAuditLog(
                "UPDATE_LOCATION",
                "LOCATION",
                updatedLocation.getId(),
                "Updated location from " + oldCode + " - " + oldName + " to " + updatedLocation.getCode() + " - " + updatedLocation.getName(),
                performedBy
        );

        return updatedLocation;
    }

    public InventoryLocation deleteLocation(Long id, String performedBy) {
        appUserService.requireManagerOrAdmin(performedBy);

        InventoryLocation existingLocation = inventoryLocationRepository.findById(id);

        if (existingLocation == null) {
            return null;
        }

        if (inventoryBalanceRepository.existsByLocationId(id)) {
            throw new IllegalStateException("Cannot delete location with inventory balances.");
        }

        if (stockMovementRepository.existsByLocationId(id)) {
            throw new IllegalStateException("Cannot delete location with stock movement history.");
        }

        if (stockTransferRepository.existsByLocationId(id)) {
            throw new IllegalStateException("Cannot delete location with stock transfer history.");
        }

        inventoryLocationRepository.delete(existingLocation);

        auditLogService.createAuditLog(
                "DELETE_LOCATION",
                "LOCATION",
                existingLocation.getId(),
                "Deleted location: " + existingLocation.getCode(),
                performedBy
        );

        return existingLocation;
    }
}