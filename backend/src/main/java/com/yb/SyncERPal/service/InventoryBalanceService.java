package com.yb.SyncERPal.service;

import com.yb.SyncERPal.model.InventoryBalance;
import com.yb.SyncERPal.repository.InventoryBalanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryBalanceService {

    private final InventoryBalanceRepository inventoryBalanceRepository;

    public InventoryBalanceService(InventoryBalanceRepository inventoryBalanceRepository) {
        this.inventoryBalanceRepository = inventoryBalanceRepository;
    }

    public List<InventoryBalance> getAllBalances() {
        return inventoryBalanceRepository.findAll();
    }

    public InventoryBalance getOrCreateBalance(Long itemId, Long locationId) {
        InventoryBalance inventoryBalance =
                inventoryBalanceRepository.findByItemIdAndLocationId(itemId, locationId);

        if (inventoryBalance != null) {
            return inventoryBalance;
        }

        InventoryBalance newBalance = new InventoryBalance(itemId, locationId, 0);

        return inventoryBalanceRepository.save(newBalance);
    }

    public InventoryBalance updateBalance(Long itemId, Long locationId, Integer newQuantity) {
        InventoryBalance inventoryBalance = getOrCreateBalance(itemId, locationId);

        inventoryBalance.setQuantity(newQuantity);

        return inventoryBalanceRepository.save(inventoryBalance);
    }

    public Integer getTotalQuantityForItem(Long itemId) {
        return inventoryBalanceRepository.findByItemId(itemId)
                .stream()
                .mapToInt(InventoryBalance::getQuantity)
                .sum();
    }
}