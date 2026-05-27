package com.yb.SyncERPal.service;

import com.yb.SyncERPal.model.Item;
import com.yb.SyncERPal.repository.ItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

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
}