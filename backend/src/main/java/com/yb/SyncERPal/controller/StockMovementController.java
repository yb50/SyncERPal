package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.StockMovement;
import com.yb.SyncERPal.service.StockMovementService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class StockMovementController {

    private final StockMovementService stockMovementService;

    public StockMovementController(StockMovementService stockMovementService) {
        this.stockMovementService = stockMovementService;
    }

    @GetMapping("/stock-movements")
    public List<StockMovement> getAllStockMovements() {
        return stockMovementService.getAllStockMovements();
    }
}
