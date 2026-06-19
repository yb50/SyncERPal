package com.yb.SyncERPal.repository;

import com.yb.SyncERPal.model.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockMovementJpaRepository extends JpaRepository<StockMovement, Long> {
}
