package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.Item;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ItemController {

    @GetMapping("/items")
    public List<Item> allItems() {
        Item item1 = new Item(1L, "USB Cable", "USB-001");
        Item item2 = new Item(2L, "Keyboard", "KEY-001");

        return List.of(item1, item2);
    }
}
