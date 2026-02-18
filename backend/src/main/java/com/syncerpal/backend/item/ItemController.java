package com.syncerpal.backend.item;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import com.syncerpal.backend.item.requests.CreateItemRequest;
import com.syncerpal.backend.item.requests.UpdateItemRequest;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
public class ItemController {

    private final ItemRepository itemRepository;
    private final ItemService itemService;

    public ItemController(ItemRepository itemRepository, ItemService itemService) {
        this.itemRepository = itemRepository;
        this.itemService = itemService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','WORKER')")
    @GetMapping("/api/items")
    public List<Item> getItems() {
        return itemRepository.findAll();
    }

    @PreAuthorize("hasAnyRole('ADMIN','WORKER')")
    @GetMapping("/api/items/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable UUID id) {
        return itemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/api/items")
    public ResponseEntity<Item> createItem(@RequestBody CreateItemRequest request) {
        try {
            Item saved = itemService.createItemAndSeedBalances(request);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/api/items/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable UUID id, @RequestBody UpdateItemRequest request) {

        Item item = itemRepository.findById(id).orElse(null);
        if (item == null) {
            return ResponseEntity.notFound().build();
        }

        item.setNameEn(request.getNameEn());
        item.setNameJa(request.getNameJa());
        item.setBarcode(request.getBarcode());
        item.setUnit(request.getUnit());
        item.setLowStockThreshold(request.getLowStockThreshold());
        item.setActive(request.isActive());

        Item saved = itemRepository.save(item);
        return ResponseEntity.ok(saved);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/api/items/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable UUID id) {

        if (!itemRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        itemRepository.deleteById(id);
        return ResponseEntity.ok("Deleted");
    }

}