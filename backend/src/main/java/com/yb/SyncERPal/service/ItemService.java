package com.yb.SyncERPal.service;

import com.yb.SyncERPal.model.Item;
import com.yb.SyncERPal.repository.ItemRepository;
import com.yb.SyncERPal.repository.StockMovementRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final StockMovementRepository stockMovementRepository;

    public ItemService(
            ItemRepository itemRepository,
            StockMovementRepository stockMovementRepository
    ) {
        this.itemRepository = itemRepository;
        this.stockMovementRepository = stockMovementRepository;
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item getItem(Long id) {
        return itemRepository.findItem(id);
    }

    private void validateItem(Item item) {
        if (item.getName() == null || item.getName().isBlank()) {
            throw new IllegalArgumentException("Item name is required");
        }

        if (item.getSku() == null || item.getSku().isBlank()) {
            throw new IllegalArgumentException("Item SKU is required");
        }

        if (item.getQuantity() == null || item.getQuantity() < 0) {
            throw new IllegalArgumentException("Item quantity must be 0 or higher.");
        }

        if (item.getLowStockThreshold() == null || item.getLowStockThreshold() < 0) {
            throw new IllegalArgumentException("Low stock threshold must be 0 or higher.");
        }
    }

    public Item createItem(Item item) {
        validateItem(item);

        if (itemRepository.existsBySku(item.getSku())) {
            throw new IllegalArgumentException("Item SKU already exists.");
        }

        return itemRepository.save(item);
    }

    public Item updateItem(Long id, Item item) {
        validateItem(item);

        Item existingItem = itemRepository.findItem(id);

        if (existingItem == null) {
            return null;
        }

        boolean skuChanged = !existingItem.getSku().equals(item.getSku());

        if (skuChanged && itemRepository.existsBySku(item.getSku())) {
            throw new IllegalArgumentException("Item SKU already exists.");
        }

        return itemRepository.updateItem(id, item);
    }

    public Item deleteItem(Long id) {
        Item existingItem = itemRepository.findItem(id);

        if (existingItem == null) {
            return null;
        }

        if (stockMovementRepository.existsByItemId(id)) {
            throw new IllegalStateException("Cannot delete item with stock movement history");
        }

        return itemRepository.deleteItem(id);
    }

    public String exportItemsAsCsv() {
        List<Item> items = itemRepository.findAll();

        StringBuilder csv = new StringBuilder();

        csv.append("id,sku,name,quantity,lowStockThreshold,createdAt,updatedAt\n");

        for (Item item : items) {
            csv.append(item.getId()).append(",");
            csv.append(item.getSku()).append(",");
            csv.append(item.getName()).append(",");
            csv.append(item.getQuantity()).append(",");
            csv.append(item.getLowStockThreshold()).append(",");
            csv.append(item.getCreatedAt()).append(",");
            csv.append(item.getUpdatedAt()).append("\n");
        }

        return csv.toString();
    }
}