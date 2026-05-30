package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.Item;
import com.yb.SyncERPal.service.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<Item> getItem(@PathVariable Long id) {
        Item item = itemService.getItem(id);

        if (item == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(item);
    }

    @PostMapping("/items")
    public ResponseEntity<Item> createItem(
            @RequestBody Item item
    ) {
        try {
            Item createdItem = itemService.createItem(item);

            return ResponseEntity.ok(createdItem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
