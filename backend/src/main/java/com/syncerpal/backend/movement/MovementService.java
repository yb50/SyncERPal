package com.syncerpal.backend.movement;

import com.syncerpal.backend.inventory.InventoryBalance;
import com.syncerpal.backend.inventory.InventoryBalanceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class MovementService {

  private final InventoryBalanceRepository inventoryBalanceRepository;

  public MovementService(InventoryBalanceRepository inventoryBalanceRepository) {
    this.inventoryBalanceRepository = inventoryBalanceRepository;
  }

  @Transactional
  public InventoryBalance stockIn(UUID itemId, UUID toLocationId, int quantity) {
    if (quantity <= 0) {
      throw new IllegalArgumentException("Quantity must be greater than 0");
    }

    InventoryBalance balance = inventoryBalanceRepository
            .findByItemIdAndLocationId(itemId, toLocationId)
            .orElseThrow(() -> new IllegalArgumentException("Balance row not found for item/location"));

    int newQty = balance.getQuantity() + quantity;
    balance.setQuantity(newQty);

    return inventoryBalanceRepository.save(balance);
  }
}
