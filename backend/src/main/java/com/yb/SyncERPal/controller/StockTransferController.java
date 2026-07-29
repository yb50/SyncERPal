package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.StockTransferRequest;
import com.yb.SyncERPal.service.StockTransferService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class StockTransferController {

    private final StockTransferService stockTransferService;

    public StockTransferController(StockTransferService stockTransferService) {
        this.stockTransferService = stockTransferService;
    }

    @PostMapping("/stock-transfers")
    public ResponseEntity<String> transferStock(
            @RequestBody StockTransferRequest request,
            @RequestHeader(value = "X-User", defaultValue = "system") String performedBy
    ) {
        stockTransferService.transferStock(request, performedBy);

        return ResponseEntity.ok("Stock transfer completed.");
    }
}