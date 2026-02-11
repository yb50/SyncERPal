package com.syncerpal.backend.inventory;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class InventoryController {

  private final InventoryBalanceRepository inventoryBalanceRepository;

  public InventoryController(InventoryBalanceRepository inventoryBalanceRepository) {
    this.inventoryBalanceRepository = inventoryBalanceRepository;
  }

  @GetMapping("/api/inventory")
  public List<InventoryBalance> getAllBalances() {
    return inventoryBalanceRepository.findAll();
  }
}