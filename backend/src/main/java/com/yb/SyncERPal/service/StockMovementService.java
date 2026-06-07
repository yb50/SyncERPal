package com.yb.SyncERPal.service;

import com.yb.SyncERPal.model.StockMovement;
import com.yb.SyncERPal.repository.StockMovementRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockMovementService {

    private final StockMovementRepository stockMovementRepository;

    public StockMovementService(StockMovementRepository stockMovementRepository) {
        this.stockMovementRepository = stockMovementRepository;
    }

    public List<StockMovement> getAllStockMovements() {
        return stockMovementRepository.findAll();
    }

    private void validateStockMovement(StockMovement stockMovement) {
        if (stockMovement.getItemId() == null) {
            throw new IllegalArgumentException("Item id is required.");
        }

        if (stockMovement.getType() == null || stockMovement.getType().isBlank()) {
            throw new IllegalArgumentException("Movement type is required");
        }

        if (!stockMovement.getType().equals("IN") &&
                !stockMovement.getType().equals("OUT") &&
                !stockMovement.getType().equals("ADJUSTMENT")) {
            throw new IllegalArgumentException("Movement type must be IN, OUT, ADJUSTMENT.");
        }

        if (stockMovement.getQuantity() == null || stockMovement.getQuantity() <= 0) {
            throw new IllegalArgumentException("Movement quantity must be greater than 0.");
        }
    }

    public StockMovement createStockMovement(StockMovement stockMovement) {
        validateStockMovement(stockMovement);

        return stockMovementRepository.save(stockMovement);
    }
}
