package com.syncerpal.backend.movement;

import com.syncerpal.backend.inventory.InventoryBalance;
import com.syncerpal.backend.movement.requests.AdjustRequest;
import com.syncerpal.backend.movement.requests.StockOutRequest;
import com.syncerpal.backend.movement.requests.TransferRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MovementController {

    private final MovementService movementService;
    private final StockMovementRepository stockMovementRepository;

    public MovementController(MovementService movementService, StockMovementRepository stockMovementRepository) {
        this.movementService = movementService;
        this.stockMovementRepository = stockMovementRepository;
    }

    // In
    @PostMapping("/api/movements/in")
    public InventoryBalance stockIn(@RequestBody StockInRequest request) {
        return movementService.stockIn(
                request.getItemId(),
                request.getToLocationId(),
                request.getQuantity(),
                request.getNote()
        );
    }

    // Out
    @PostMapping("/api/movements/out")
    public InventoryBalance stockOut(@RequestBody StockOutRequest request) {
        return movementService.stockOut(
                request.getItemId(),
                request.getFromLocationId(),
                request.getQuantity(),
                request.getNote()
        );
    }

    // Transfer
    @PostMapping("/api/movements/transfer")
    public String transfer(@RequestBody TransferRequest request) {
        movementService.transfer(
                request.getItemId(),
                request.getFromLocationId(),
                request.getToLocationId(),
                request.getQuantity(),
                request.getNote()
        );
        return "OK";
    }

    // Adjust
    @PostMapping("/api/movements/adjust")
    public InventoryBalance adjust(@RequestBody AdjustRequest request) {
        return movementService.adjust(
                request.getItemId(),
                request.getLocationId(),
                request.getQuantity(),
                request.getDirection(),
                request.getNote()
        );
    }

    // Movement history
    @GetMapping("/api/movements")
    public List<StockMovement> getMovements() {
        return stockMovementRepository.findAll();
    }
}