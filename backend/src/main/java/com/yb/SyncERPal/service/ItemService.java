package com.yb.SyncERPal.service;

import com.yb.SyncERPal.model.Item;
import com.yb.SyncERPal.repository.ItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item getItem(Long id) {
        return itemRepository.findItem(id);
    }

    public Item createItem(Item item) {
        if (item.getName() == null || item.getName().isBlank()) {
            throw new IllegalArgumentException("Item name is required");
        }

        if (item.getSku() == null || item.getSku().isBlank()) {
            throw new IllegalArgumentException("item SKU is required");
        }

        return itemRepository.save(item);
    }

    public Item updateItem(Long id, Item item) {
        if (item.getName() == null || item.getName().isBlank()) {
            throw new IllegalArgumentException("Item name is required.");
        }

        if (item.getSku() == null || item.getSku().isBlank()) {
            throw new IllegalArgumentException("Item SKU is required");
        }

        return itemRepository.updateItem(id, item);
    }

    public Item deleteItem(Long id) {
        return itemRepository.deleteItem(id);
    }
}