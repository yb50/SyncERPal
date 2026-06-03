package com.yb.SyncERPal.repository;

import com.yb.SyncERPal.model.Item;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ItemRepository {

    private final List<Item> items = new ArrayList<>();

    public ItemRepository() {
        items.add(new Item(1L, "USB Cable", "USB-001"));
        items.add(new Item(2L, "Keyboard", "KEY-001"));
    }

    public List<Item> findAll() {
        return items;
    }

    public Item findItem(Long id) {
        for (Item item : items) {
            if (item.getId().equals(id)) {
                return item;
            }
        }

        return null;
    }

    public Item save(Item item) {
        Long newId = (long) (items.size() + 1);

        item.setId(newId);
        items.add(item);

        return item;
    }

    public Item updateItem(Long id, Item item) {
        for (Item existingItem : items) {
            if (existingItem.getId().equals(id)) {
                existingItem.setName(item.getName());
                existingItem.setSku(item.getSku());

                return existingItem;
            }
        }

        return null;
    }

    public Item deleteItem(Long id) {
        for (Item existingItem : items) {
            if (existingItem.getId().equals(id)) {
                items.remove(existingItem);
                return existingItem;
            }
        }

        return null;
    }
}