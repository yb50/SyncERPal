package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.Item;
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
            @RequestHeader(value = "X-user", defaultValue = "system") String performedBy
    ) {
        Item createdItem = itemService.createItem(item, performedBy);

        return ResponseEntity.ok(createdItem);
    }

    @PostMapping("/items/import")
    public ResponseEntity<String> importItems(
            @RequestParam("file")MultipartFile file,
            @RequestHeader(value = "X-User", defaultValue = "system") String performedby
    ) {
        int importedCount = itemService.importItemsFromCsv(file, performedby);

        return ResponseEntity.ok("imported " + importedCount + " items.");
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<?> updateItem(
            @PathVariable Long id,
            @RequestBody Item item,
            @RequestHeader(value = "X-User", defaultValue = "system") String performedBy
    ) {
        Item updatedItem = itemService.updateItem(id, item, performedBy);

        if (updatedItem == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedItem);
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<?> deleteItem(
            @PathVariable Long id,
            @RequestHeader(value = "X-User", defaultValue = "system") String performedBy
    ) {
        Item deletedItem = itemService.deleteItem(id, performedBy);

        if (deletedItem == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(deletedItem);
    }
}
