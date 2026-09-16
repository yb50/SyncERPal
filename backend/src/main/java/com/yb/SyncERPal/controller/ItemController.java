package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.AppUser;
import com.yb.SyncERPal.model.Item;
import com.yb.SyncERPal.service.AuthService;
import com.yb.SyncERPal.service.ItemService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class ItemController {

    private final ItemService itemService;
    private final AuthService authService;

    public ItemController(ItemService itemService, AuthService authService) {
        this.itemService = itemService;
        this.authService = authService;
    }

    @GetMapping("/items")
    public List<Item> getAllItems() {
        return itemService.getAllItems();
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<Item> getItem(
            @PathVariable Long id
    ) {
        Item item = itemService.getItem(id);

        if (item == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(item);
    }

    @GetMapping("/items/export")
    public ResponseEntity<String> exportItems() {
        String csv = itemService.exportItemsAsCsv();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=items.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    @PostMapping("/items")
    public ResponseEntity<Item> createItem(
            @RequestBody Item item,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        AppUser currentUser = authService.getAuthenticatedUser(authorizationHeader);

        Item createdItem = itemService.createItem(item, currentUser.getUsername());

        return ResponseEntity.ok(createdItem);
    }

    @PostMapping("/items/import")
    public ResponseEntity<String> importItems(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        AppUser currentUser = authService.getAuthenticatedUser(authorizationHeader);

        int importedCount = itemService.importItemsFromCsv(file, currentUser.getUsername());

        return ResponseEntity.ok("Imported " + importedCount + " items.");
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<Item> updateItem(
            @PathVariable Long id,
            @RequestBody Item item,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        AppUser currentUser = authService.getAuthenticatedUser(authorizationHeader);

        Item updatedItem = itemService.updateItem(id, item, currentUser.getUsername());

        if (updatedItem == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedItem);
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteItem(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        AppUser currentUser = authService.getAuthenticatedUser(authorizationHeader);

        itemService.deleteItem(id, currentUser.getUsername());

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/items/low-stock/export")
    public ResponseEntity<String> exportLowStockItems() {
        String csv = itemService.exportLowStockItemsAsCsv();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=low-stock-items.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}
