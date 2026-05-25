package com.yb.SyncERPal.service;

import com.yb.SyncERPal.model.Item;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {

    public List<Item> getAllItems() {
        Item item1 = new Item(1L, "USB Cable", "USB-001");
        Item item2 = new Item(2L, "Keyboard", "KEY-001");

        return List.of(item1, item2);
    }
}