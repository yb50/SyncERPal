package com.yb.SyncERPal.repository;

import com.yb.SyncERPal.model.InventoryBalance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventoryBalanceJpaRepository extends JpaRepository<InventoryBalance, Long> {

    List<InventoryBalance> findAllByOrderByItemIdAscLocationIdAsc();

    Optional<InventoryBalance> findByItemIdAndLocationId(Long itemId, Long locationId);

    List<InventoryBalance> findByItemId(Long itemId);
}
