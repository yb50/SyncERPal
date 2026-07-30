package com.yb.SyncERPal.service;

import com.yb.SyncERPal.model.InventoryBalance;
import com.yb.SyncERPal.model.InventoryLocation;
import com.yb.SyncERPal.model.Item;
import com.yb.SyncERPal.model.StockTransfer;
import com.yb.SyncERPal.model.StockTransferRequest;
import com.yb.SyncERPal.repository.InventoryLocationRepository;
import com.yb.SyncERPal.repository.ItemRepository;
import com.yb.SyncERPal.repository.StockTransferRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockTransferService {

    private final AppUserService appUserService;
    private final ItemRepository itemRepository;
    private final InventoryLocationRepository inventoryLocationRepository;
    private final InventoryBalanceService inventoryBalanceService;
    private final StockTransferRepository stockTransferRepository;
    private final AuditLogService auditLogService;

    public StockTransferService(
            AppUserService appUserService,
            ItemRepository itemRepository,
            InventoryLocationRepository inventoryLocationRepository,
            InventoryBalanceService inventoryBalanceService,
            StockTransferRepository stockTransferRepository,
            AuditLogService auditLogService
    ) {
        this.appUserService = appUserService;
        this.itemRepository = itemRepository;
        this.inventoryLocationRepository = inventoryLocationRepository;
        this.inventoryBalanceService = inventoryBalanceService;
        this.stockTransferRepository = stockTransferRepository;
        this.auditLogService = auditLogService;
    }

    private void validateTransferRequest(StockTransferRequest request) {
        if (request.getItemId() == null) {
            throw new IllegalArgumentException("Item is required.");
        }

        if (request.getFromLocationId() == null) {
            throw new IllegalArgumentException("Source location is required.");
        }

        if (request.getToLocationId() == null) {
            throw new IllegalArgumentException("Destination location is required.");
        }

        if (request.getFromLocationId().equals(request.getToLocationId())) {
            throw new IllegalArgumentException("Source and destination locations must be different.");
        }

        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new IllegalArgumentException("Transfer quantity must be greater than 0.");
        }
    }

    public List<StockTransfer> getAllStockTransfers() {
        return stockTransferRepository.findAll();
    }

    @Transactional
    public StockTransfer transferStock(StockTransferRequest request, String performedBy) {
        appUserService.requireExistingUser(performedBy);

        validateTransferRequest(request);

        Item item = itemRepository.findItem(request.getItemId());

        if (item == null) {
            throw new IllegalArgumentException("Item does not exist.");
        }

        InventoryLocation fromLocation =
                inventoryLocationRepository.findById(request.getFromLocationId());

        if (fromLocation == null) {
            throw new IllegalArgumentException("Source location does not exist.");
        }

        InventoryLocation toLocation =
                inventoryLocationRepository.findById(request.getToLocationId());

        if (toLocation == null) {
            throw new IllegalArgumentException("Destination location does not exist.");
        }

        InventoryBalance fromBalance =
                inventoryBalanceService.getOrCreateBalance(
                        request.getItemId(),
                        request.getFromLocationId()
                );

        InventoryBalance toBalance =
                inventoryBalanceService.getOrCreateBalance(
                        request.getItemId(),
                        request.getToLocationId()
                );

        int newFromQuantity = fromBalance.getQuantity() - request.getQuantity();

        if (newFromQuantity < 0) {
            throw new IllegalArgumentException("Source location quantity cannot go below 0.");
        }

        int newToQuantity = toBalance.getQuantity() + request.getQuantity();

        inventoryBalanceService.updateBalance(
                request.getItemId(),
                request.getFromLocationId(),
                newFromQuantity
        );

        inventoryBalanceService.updateBalance(
                request.getItemId(),
                request.getToLocationId(),
                newToQuantity
        );

        Integer newTotalItemQuantity =
                inventoryBalanceService.getTotalQuantityForItem(request.getItemId());

        itemRepository.updateQuantity(item.getId(), newTotalItemQuantity);

        StockTransfer stockTransfer = new StockTransfer(
                request.getItemId(),
                request.getFromLocationId(),
                request.getToLocationId(),
                request.getQuantity(),
                request.getNote(),
                performedBy
        );

        StockTransfer savedStockTransfer = stockTransferRepository.save(stockTransfer);

        auditLogService.createAuditLog(
                "TRANSFER_STOCK",
                "STOCK_TRANSFER",
                savedStockTransfer.getId(),
                "Transferred " + request.getQuantity() +
                        " of item " + item.getSku() +
                        " from " + fromLocation.getCode() +
                        " to " + toLocation.getCode(),
                performedBy
        );

        return savedStockTransfer;
    }
}