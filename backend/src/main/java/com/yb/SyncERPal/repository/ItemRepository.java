package com.yb.SyncERPal.repository;

import com.yb.SyncERPal.model.Item;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ItemRepository {

    private final ItemJpaRepository itemJpaRepository;

    public ItemRepository(ItemJpaRepository itemJpaRepository) {
        this.itemJpaRepository = itemJpaRepository;
    }

    public List<Item> findAll() {
        return itemJpaRepository.findAll();
    }

    public Item findItem(Long id) {
        return itemJpaRepository.findById(id).orElse(null);
    }

    public Item save(Item item) {
        return itemJpaRepository.save(item);
    }

    public Item updateItem(Long id, Item item) {
        Item existingItem = findItem(id);

        if (existingItem == null) {
            return null;
        }

        existingItem.setName(item.getName());
        existingItem.setSku(item.getSku());
        existingItem.setLowStockThreshold(item.getLowStockThreshold());

        return itemJpaRepository.save(existingItem);
    }

    public Item deleteItem(Long id) {
        Item existingItem = findItem(id);

        if (existingItem == null) {
            return null;
        }

        itemJpaRepository.delete(existingItem);

        return existingItem;
    }

    public Item updateQuantity(Long id, Integer newQuantity) {
        Item existingItem = findItem(id);

        if (existingItem == null) {
            return null;
        }

        existingItem.setQuantity(newQuantity);

        return itemJpaRepository.save(existingItem);
    }
}