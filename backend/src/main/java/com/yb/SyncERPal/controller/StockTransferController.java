package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.AppUser;
import com.yb.SyncERPal.model.StockTransfer;
import com.yb.SyncERPal.model.StockTransferRequest;
import com.yb.SyncERPal.service.StockTransferService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class StockTransferController {

    private final StockTransferService stockTransferService;

    public StockTransferController(
            StockTransferService stockTransferService
    ) {
        this.stockTransferService = stockTransferService;
    }

    @GetMapping("/stock-transfers")
    public List<StockTransfer> getAllStockTransfers() {
        return stockTransferService.getAllStockTransfers();
    }

    @PostMapping("/stock-transfers")
    public StockTransfer transferStock(
            @RequestBody StockTransferRequest request,
            @AuthenticationPrincipal AppUser currentUser
    ) {
        return stockTransferService.transferStock(
                request,
                currentUser.getUsername()
        );
    }

    @GetMapping("/stock-transfers/export")
    public ResponseEntity<String> exportStockTransfers() {
        String csv = stockTransferService.exportStockTransfersAsCsv();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=stock-transfers.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}