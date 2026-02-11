package com.syncerpal.backend.inventory;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface InventoryBalanceRepository extends JpaRepository<InventoryBalance, UUID> {

  Optional<InventoryBalance> findByItemIdAndLocationId(UUID itemId, UUID locationId);
  boolean existsByItemIdAndLocationId(UUID itemId, UUID locationId);
}
