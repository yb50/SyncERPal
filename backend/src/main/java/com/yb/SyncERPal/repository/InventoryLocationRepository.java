package com.yb.SyncERPal.repository;

import com.yb.SyncERPal.model.InventoryLocation;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class InventoryLocationRepository {

    private final InventoryLocationJpaRepository inventoryLocationJpaRepository;

    public InventoryLocationRepository(InventoryLocationJpaRepository inventoryLocationJpaRepository) {
        this.inventoryLocationJpaRepository = inventoryLocationJpaRepository;
    }

    public List<InventoryLocation> findAll() {
        return inventoryLocationJpaRepository.findAllByOrderByCodeAsc();
    }

    public boolean existsByCode(String code) {
        return inventoryLocationJpaRepository.existsByCode(code);
    }

    public InventoryLocation save(InventoryLocation inventoryLocation) {
        return inventoryLocationJpaRepository.save(inventoryLocation);
    }

    public InventoryLocation findById(Long id) {
        return inventoryLocationJpaRepository.findById(id).orElse(null);
    }

    public void delete(InventoryLocation inventoryLocation) {
        inventoryLocationJpaRepository.delete(inventoryLocation);
    }
}