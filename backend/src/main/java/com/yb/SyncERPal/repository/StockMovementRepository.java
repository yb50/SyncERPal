package com.yb.SyncERPal.repository;

import com.yb.SyncERPal.model.StockMovement;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public class StockMovementRepository {

    private final StockMovementJpaRepository stockMovementJpaRepository;

    public StockMovementRepository(StockMovementJpaRepository stockMovementJpaRepository) {
        this.stockMovementJpaRepository = stockMovementJpaRepository;
    }

    public List<StockMovement> findAll() {
        return stockMovementJpaRepository.findAll();
    }

    public StockMovement save(StockMovement stockMovement) {
        stockMovement.setCreatedAt(LocalDateTime.now());

        return stockMovementJpaRepository.save(stockMovement);
    }
}
