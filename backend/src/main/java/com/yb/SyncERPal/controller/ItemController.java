package com.yb.SyncERPal.controller;

import com.yb.SyncERPal.model.Item;
import com.yb.SyncERPal.service.ItemService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

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
    public Item getItem(@PathVariable Long id) {
        return itemService.getItem(id);
    }
}
