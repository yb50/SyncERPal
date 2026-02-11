package com.syncerpal.backend.movement;

import com.syncerpal.backend.inventory.InventoryBalance;
import org.springframework.web.bind.annotation.*;

@RestController
public class MovementController {

  private final MovementService movementService;

  public MovementController(MovementService movementService) {
    this.movementService = movementService;
  }

  @PostMapping("/api/movements/in")
  public InventoryBalance stockIn(@RequestBody StockInRequest request) {
    return movementService.stockIn(
        request.getItemId(),
        request.getToLocationId(),
        request.getQuantity());
  }
}