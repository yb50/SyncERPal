package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.AppUser;
import com.yb.SyncERPal.model.Item;
import com.yb.SyncERPal.service.ItemService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
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

    @PostMapping("/items")
    public Item createItem(
            @RequestBody Item item,
            @AuthenticationPrincipal AppUser currentUser
    ) {
        return itemService.createItem(item, currentUser.getUsername());
    }

    @PutMapping("/items/{id}")
    public Item updateItem(
            @PathVariable Long id,
            @RequestBody Item item,
            @AuthenticationPrincipal AppUser currentUser
    ) {
        return itemService.updateItem(id, item, currentUser.getUsername());
    }

    @DeleteMapping("/items/{id}")
    public Item deleteItem(
            @PathVariable Long id,
            @AuthenticationPrincipal AppUser currentUser
    ) {
        return itemService.deleteItem(id, currentUser.getUsername());
    }

    @PostMapping("/items/import")
    public void importItems(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal AppUser currentUser
    ) {
        itemService.importItemsFromCsv(file, currentUser.getUsername());
    }

    @GetMapping("/items/export")
    public ResponseEntity<String> exportItems() {
        String csv = itemService.exportItemsAsCsv();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=items.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
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
