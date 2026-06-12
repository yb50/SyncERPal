package com.yb.SyncERPal.repository;

import com.yb.SyncERPal.model.StockMovement;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class StockMovementRepository {

    private final List<StockMovement> movements = new ArrayList<>();

    public StockMovementRepository() {
        movements.add(new StockMovement(1L, 1L, "IN", 20, "Initial stock", LocalDateTime.now().minusDays(2)));
        movements.add(new StockMovement(2L, 1L, "OUT", 5, "Used for order", LocalDateTime.now().minusDays(1)));
        movements.add(new StockMovement(3L, 2L, "IN", 10, "New delivery", LocalDateTime.now()));
    }

    public List<StockMovement> findAll() {
        return movements;
    }

    public StockMovement save(StockMovement stockMovement) {
        Long newId = (long) (movements.size() + 1);

        stockMovement.setId(newId);
        stockMovement.setCreatedAt(LocalDateTime.now());

        movements.add(stockMovement);

        return stockMovement;
    }
}
