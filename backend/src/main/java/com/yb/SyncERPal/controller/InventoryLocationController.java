package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.AppUser;
import com.yb.SyncERPal.model.InventoryLocation;
import com.yb.SyncERPal.service.AuthService;
import com.yb.SyncERPal.service.InventoryLocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class InventoryLocationController {

    private final InventoryLocationService inventoryLocationService;
    private final AuthService authService;

    public InventoryLocationController(
            InventoryLocationService inventoryLocationService,
            AuthService authService
    ) {
        this.inventoryLocationService = inventoryLocationService;
        this.authService = authService;
    }

    @GetMapping("/locations")
    public List<InventoryLocation> getAllLocations() {
        return inventoryLocationService.getAllLocations();
    }

    @PostMapping("/locations")
    public InventoryLocation createLocation(
            @RequestBody InventoryLocation inventoryLocation,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        AppUser currentUser = authService.getAuthenticatedUser(authorizationHeader);

        return inventoryLocationService.createLocation(
                inventoryLocation,
                currentUser.getUsername()
        );
    }

    @PutMapping("/locations/{id}")
    public ResponseEntity<InventoryLocation> updateLocation(
            @PathVariable Long id,
            @RequestBody InventoryLocation inventoryLocation,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        AppUser currentUser = authService.getAuthenticatedUser(authorizationHeader);

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
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        AppUser currentUser = authService.getAuthenticatedUser(authorizationHeader);

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