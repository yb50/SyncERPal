package com.yb.SyncERPal.repository;

import com.yb.SyncERPal.model.StockTransfer;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class StockTransferRepository {

    private final StockTransferJpaRepository stockTransferJpaRepository;

    public StockTransferRepository(StockTransferJpaRepository stockTransferJpaRepository) {
        this.stockTransferJpaRepository = stockTransferJpaRepository;
    }

    public List<StockTransfer> findAll() {
        return stockTransferJpaRepository.findAllByOrderByCreatedAtDesc();
    }

    public StockTransfer save(StockTransfer stockTransfer) {
        return stockTransferJpaRepository.save(stockTransfer);
    }

    public boolean existsByLocationId(Long locationId) {
        return stockTransferJpaRepository.existsByFromLocationIdOrToLocationId(locationId, locationId);
    }

    public boolean existsByItemId(Long itemId) {
        return stockTransferJpaRepository.existsByItemId(itemId);
    }
}