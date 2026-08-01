package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.InventoryLocation;
import com.yb.SyncERPal.service.InventoryLocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("/locations/{id}")
    public ResponseEntity<InventoryLocation> updateLocation(
            @PathVariable Long id,
            @RequestBody InventoryLocation inventoryLocation,
            @RequestHeader(value = "X-User", defaultValue = "system") String performedBy
    ) {
        InventoryLocation updatedLocation =
                inventoryLocationService.updateLocation(id, inventoryLocation, performedBy);

        if (updatedLocation == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedLocation);
    }
}