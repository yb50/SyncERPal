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
}
