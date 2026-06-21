package com.yb.SyncERPal.repository;

import com.yb.SyncERPal.model.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockMovementJpaRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findByItemIdOrderByCreatedAtDesc(Long itemId);

    List<StockMovement> findAllByOrderByCreatedAtDesc();
}
