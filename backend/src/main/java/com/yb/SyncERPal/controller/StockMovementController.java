package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.AppUser;
import com.yb.SyncERPal.model.StockMovement;
import com.yb.SyncERPal.service.AuthService;
import com.yb.SyncERPal.service.StockMovementService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class StockMovementController {

    private final StockMovementService stockMovementService;
    private final AuthService authService;

    public StockMovementController(
            StockMovementService stockMovementService,
            AuthService authService
    ) {
        this.stockMovementService = stockMovementService;
        this.authService = authService;
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

    @PostMapping("/stock-movements")
    public StockMovement createStockMovement(
            @RequestBody StockMovement stockMovement,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        AppUser currentUser = authService.getAuthenticatedUser(authorizationHeader);

        return stockMovementService.createStockMovement(
                stockMovement, currentUser.getUsername()
        );
    }

    @GetMapping("/items/{id}/stock-movements")
    public List<StockMovement> getStockMovementsForItem(@PathVariable Long id) {
        return stockMovementService.getStockMovementsByItemId(id);
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
