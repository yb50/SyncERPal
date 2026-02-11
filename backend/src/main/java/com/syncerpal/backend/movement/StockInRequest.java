package com.syncerpal.backend.movement;

import java.util.UUID;

public class StockInRequest {

  private UUID itemId;
  private UUID toLocationId;
  private int quantity;

  public StockInRequest() {}

  // Get
  public UUID getItemId() { return itemId; }
  public UUID getToLocationId() { return toLocationId; }
  public int getQuantity() { return quantity; }

  // Set
  public void setItemId(UUID itemId) { this.itemId = itemId; }
  public void setToLocationId(UUID toLocationId) { this.toLocationId = toLocationId; }
  public void setQuantity(int quantity) { this.quantity = quantity; }
}
