package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.InventoryLocation;
import com.yb.SyncERPal.service.InventoryLocationService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class InventoryLocationController {

    private final InventoryLocationService inventoryLocationService;

    public InventoryLocationController(InventoryLocationService inventoryLocationService) {
        this.inventoryLocationService = inventoryLocationService;
    }

    @GetMapping("/locations")
    public List<InventoryLocation> getAllLocations() {
        return inventoryLocationService.getAllLocations();
    }

    @PostMapping("/locations")
    public InventoryLocation createLocation(
            @RequestBody InventoryLocation inventoryLocation,
            @RequestHeader(value = "X-User", defaultValue = "system") String performedBy
    ) {
        return inventoryLocationService.createLocation(inventoryLocation, performedBy);
    }
}