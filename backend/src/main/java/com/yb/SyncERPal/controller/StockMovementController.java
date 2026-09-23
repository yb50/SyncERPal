package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.AppUser;
import com.yb.SyncERPal.model.StockMovement;
import com.yb.SyncERPal.service.StockMovementService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class StockMovementController {

    private final StockMovementService stockMovementService;

    public StockMovementController(
            StockMovementService stockMovementService
    ) {
        this.stockMovementService = stockMovementService;
    }

    @GetMapping("/stock-movements")
    public List<StockMovement> getStockMovements(
            @RequestParam(required = false) Long itemId
    ) {
        if (itemId == null) {
            return stockMovementService.getAllStockMovements();
        }

        return stockMovementService.getStockMovementsByItemId(itemId);
    }

    @GetMapping("/items/{id}/stock-movements")
    public List<StockMovement> getStockMovementsForItem(@PathVariable Long id) {
        return stockMovementService.getStockMovementsByItemId(id);
    }

    @PostMapping("/stock-movements")
    public StockMovement createStockMovement(
            @RequestBody StockMovement stockMovement,
            @AuthenticationPrincipal AppUser currentUser
    ) {
        return stockMovementService.createStockMovement(
                stockMovement,
                currentUser.getUsername()
        );
    }

    @GetMapping("/stock-movements/export")
    public ResponseEntity<String> exportStockMovements() {
        String csv = stockMovementService.exportStockMovementsAsCsv();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=stock-movements.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}
