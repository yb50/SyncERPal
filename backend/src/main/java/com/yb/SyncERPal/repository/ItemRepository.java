package com.yb.SyncERPal.repository;

import com.yb.SyncERPal.model.Item;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ItemRepository {

    public List<Item> findAll() {
        Item item1 = new Item(1L, "USB Cable", "USB-001");
        Item item2 = new Item(2L, "Keyboard", "KEY-001");

        return List.of(item1, item2);
    }

    public Item findItem(Long id) {
        List<Item> items = findAll();

        for (Item item : items) {
            if (item.getId().equals(id)) {
                return item;
            }
        }

        return null;
    }
}
