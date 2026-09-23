package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.AppUser;
import com.yb.SyncERPal.model.InventoryLocation;
import com.yb.SyncERPal.service.AuthService;
import com.yb.SyncERPal.service.InventoryLocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class InventoryLocationController {

    private final InventoryLocationService inventoryLocationService;

    public InventoryLocationController(
            InventoryLocationService inventoryLocationService
    ) {
        this.inventoryLocationService = inventoryLocationService;
    }

    @GetMapping("/locations")
    public List<InventoryLocation> getAllLocations() {
        return inventoryLocationService.getAllLocations();
    }

    @PostMapping("/locations")
    public InventoryLocation createLocation(
            @RequestBody InventoryLocation inventoryLocation,
            @AuthenticationPrincipal AppUser currentUser
    ) {
        return inventoryLocationService.createLocation(
                inventoryLocation,
                currentUser.getUsername()
        );
    }

    @PutMapping("/locations/{id}")
    public ResponseEntity<InventoryLocation> updateLocation(
            @PathVariable Long id,
            @RequestBody InventoryLocation inventoryLocation,
            @AuthenticationPrincipal AppUser currentUser
    ) {
        InventoryLocation updatedLocation =
                inventoryLocationService.updateLocation(
                        id,
                        inventoryLocation,
                        currentUser.getUsername()
                );

        if (updatedLocation == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedLocation);
    }

    @DeleteMapping("/locations/{id}")
    public ResponseEntity<InventoryLocation> deleteLocation(
            @PathVariable Long id,
            @AuthenticationPrincipal AppUser currentUser
    ) {
        InventoryLocation deletedLocation =
                inventoryLocationService.deleteLocation(
                        id,
                        currentUser.getUsername()
                );

        if (deletedLocation == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(deletedLocation);
    }
}