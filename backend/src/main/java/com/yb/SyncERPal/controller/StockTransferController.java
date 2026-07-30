package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.StockTransfer;
import com.yb.SyncERPal.model.StockTransferRequest;
import com.yb.SyncERPal.service.StockTransferService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class StockTransferController {

    private final StockTransferService stockTransferService;

    public StockTransferController(StockTransferService stockTransferService) {
        this.stockTransferService = stockTransferService;
    }

    @GetMapping("/stock-transfers")
    public List<StockTransfer> getAllStockTransfers() {
        return stockTransferService.getAllStockTransfers();
    }

    @PostMapping("/stock-transfers")
    public StockTransfer transferStock(
            @RequestBody StockTransferRequest request,
            @RequestHeader(value = "X-User", defaultValue = "system") String performedBy
    ) {
        return stockTransferService.transferStock(request, performedBy);
    }
}