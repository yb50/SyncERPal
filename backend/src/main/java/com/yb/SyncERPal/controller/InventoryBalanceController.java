package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.InventoryBalance;
import com.yb.SyncERPal.service.InventoryBalanceService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class InventoryBalanceController {

    private final InventoryBalanceService inventoryBalanceService;

    public InventoryBalanceController(InventoryBalanceService inventoryBalanceService) {
        this.inventoryBalanceService = inventoryBalanceService;
    }

    @GetMapping("/inventory-balances")
    public List<InventoryBalance> getAllBalances() {
        return inventoryBalanceService.getAllBalances();
    }

    @GetMapping("/inventory-balances/export")
    public ResponseEntity<String> exportInventoryBalances() {
        String csv = inventoryBalanceService.exportInventoryBalancesAsCsv();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=inventory-balances.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}