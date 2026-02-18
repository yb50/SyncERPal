package com.syncerpal.backend.inventory;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
public class InventoryController {

  private final InventoryBalanceRepository inventoryBalanceRepository;

  public InventoryController(InventoryBalanceRepository inventoryBalanceRepository) {
    this.inventoryBalanceRepository = inventoryBalanceRepository;
  }

  @PreAuthorize("hasAnyRole('ADMIN','WORKER')")  
  @GetMapping("/api/inventory")  
  public List<InventoryBalance> getAllBalances() {  
    return inventoryBalanceRepository.findAll();  
  }
}