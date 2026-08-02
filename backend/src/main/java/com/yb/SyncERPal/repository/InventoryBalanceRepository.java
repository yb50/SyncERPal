package com.yb.SyncERPal.repository;

import com.yb.SyncERPal.model.InventoryBalance;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class InventoryBalanceRepository {

    private final InventoryBalanceJpaRepository inventoryBalanceJpaRepository;

    public InventoryBalanceRepository(InventoryBalanceJpaRepository inventoryBalanceJpaRepository) {
        this.inventoryBalanceJpaRepository = inventoryBalanceJpaRepository;
    }

    public List<InventoryBalance> findAll() {
        return inventoryBalanceJpaRepository.findAllByOrderByItemIdAscLocationIdAsc();
    }

    public InventoryBalance findByItemIdAndLocationId(Long itemId, Long locationId) {
        return inventoryBalanceJpaRepository
                .findByItemIdAndLocationId(itemId, locationId)
                .orElse(null);
    }

    public List<InventoryBalance> findByItemId(Long itemId) {
        return inventoryBalanceJpaRepository.findByItemId(itemId);
    }

    public InventoryBalance save(InventoryBalance inventoryBalance) {
        return inventoryBalanceJpaRepository.save(inventoryBalance);
    }

    public boolean existsByLocationId(Long locationId) {
        return inventoryBalanceJpaRepository.existsByLocationId(locationId);
    }
}