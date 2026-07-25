package com.yb.SyncERPal.service;

import com.yb.SyncERPal.model.*;
import com.yb.SyncERPal.repository.InventoryLocationRepository;
import com.yb.SyncERPal.repository.ItemRepository;
import com.yb.SyncERPal.repository.StockMovementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StockMovementService {

    private final StockMovementRepository stockMovementRepository;
    private final ItemRepository itemRepository;
    private final AuditLogService auditLogService;
    private final AppUserService appUserService;
    private final InventoryLocationRepository inventoryLocationRepository;
    private final InventoryBalanceService inventoryBalanceService;

    public StockMovementService(
            StockMovementRepository stockMovementRepository,
            ItemRepository itemRepository,
            AuditLogService auditLogService,
            AppUserService appUserService,
            InventoryLocationRepository inventoryLocationRepository,
            InventoryBalanceService inventoryBalanceService
    ) {
        this.stockMovementRepository = stockMovementRepository;
        this.itemRepository = itemRepository;
        this.auditLogService = auditLogService;
        this.appUserService = appUserService;
        this.inventoryLocationRepository = inventoryLocationRepository;
        this.inventoryBalanceService = inventoryBalanceService;
    }

    public List<StockMovement> getAllStockMovements() {
        return stockMovementRepository.findAll();
    }

    public List<StockMovement> getStockMovementsByItemId(Long itemId) {
        return stockMovementRepository.findByItemId(itemId);
    }

    public StockMovement createStockMovement(StockMovement stockMovement) {
        return createStockMovement(stockMovement, "system");
    }

    private void validateStockMovement(StockMovement stockMovement) {
        if (stockMovement.getItemId() == null) {
            throw new IllegalArgumentException("Item id is required.");
        }

        if (stockMovement.getType() == null) {
            throw new IllegalArgumentException("Movement type is required");
        }

        if (stockMovement.getQuantity() == null || stockMovement.getQuantity() <= 0) {
            throw new IllegalArgumentException("Movement quantity must be greater than 0.");
        }

        if (stockMovement.getLocationId() == null) {
            throw new IllegalArgumentException("Location is required.");
        }
    }

    @Transactional
    public StockMovement createStockMovement(StockMovement stockMovement, String performedBy) {
        appUserService.requireExistingUser(performedBy);

        validateStockMovement(stockMovement);

        Item item = itemRepository.findItem(stockMovement.getItemId());

        if (item == null) {
            throw new IllegalArgumentException("Item does not exist.");
        }

        InventoryLocation location = inventoryLocationRepository.findById(stockMovement.getLocationId());

        if (location == null) {
            throw new IllegalArgumentException("Location does not exist.");
        }

        InventoryBalance inventoryBalance =
                inventoryBalanceService.getOrCreateBalance(
                        stockMovement.getItemId(),
                        stockMovement.getLocationId()
                );

        Integer newLocationQuantity = inventoryBalance.getQuantity();

        if (stockMovement.getType() == StockMovementType.IN) {
            newLocationQuantity = inventoryBalance.getQuantity() + stockMovement.getQuantity();
        } else if (stockMovement.getType() == StockMovementType.OUT) {
            newLocationQuantity = inventoryBalance.getQuantity() - stockMovement.getQuantity();
        } else if (stockMovement.getType() == StockMovementType.ADJUSTMENT) {
            newLocationQuantity = stockMovement.getQuantity();
        }

        if (newLocationQuantity < 0) {
            throw new IllegalArgumentException("Location quantity cannot go below 0.");
        }

        inventoryBalanceService.updateBalance(
                stockMovement.getItemId(),
                stockMovement.getLocationId(),
                newLocationQuantity
        );

        Integer newTotalItemQuantity =
                inventoryBalanceService.getTotalQuantityForItem(stockMovement.getItemId());

        itemRepository.updateQuantity(item.getId(), newTotalItemQuantity);

        StockMovement savedStockMovement = stockMovementRepository.save(stockMovement);

        auditLogService.createAuditLog(
                "CREATE_STOCK_MOVEMENT",
                "STOCK_MOVEMENT",
                savedStockMovement.getId(),
                savedStockMovement.getType() + " " +
                        savedStockMovement.getQuantity() +
                        " for item " + item.getSku() +
                        " at location " + location.getCode(),
                performedBy
        );

        return savedStockMovement;
    }

    public String exportStockMovementsAsCsv() {
        List<StockMovement> stockMovements = stockMovementRepository.findAll();

        StringBuilder csv = new StringBuilder();

        csv.append("id,itemId,type,quantity,note,createdAt\n");

        for (StockMovement movement : stockMovements) {
            csv.append(movement.getId()).append(",");
            csv.append(movement.getItemId()).append(",");
            csv.append(movement.getType()).append(",");
            csv.append(movement.getQuantity()).append(",");
            csv.append(escapeCsv(movement.getNote())).append(",");
            csv.append(movement.getCreatedAt()).append("\n");
        }

        return csv.toString();
    }

    private String escapeCsv(String value) {
        if (value == null) {
            return "";
        }

        String escapedValue = value.replace("\"", "\"\"");

        if (escapedValue.contains(",") || escapedValue.contains("\"") || escapedValue.contains("\n")) {
            return "\"" + escapedValue + "\"";
        }

        return escapedValue;
    }
}
