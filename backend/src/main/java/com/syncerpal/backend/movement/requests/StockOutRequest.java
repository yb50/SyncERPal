package com.syncerpal.backend.movement.requests;

import java.util.UUID;

public class StockOutRequest {
  private UUID itemId;
  private UUID fromLocationId;
  private int quantity;
  private String note;

  public StockOutRequest() {
  }

  public UUID getItemId() {
    return itemId;
  }

  public UUID getFromLocationId() {
    return fromLocationId;
  }

  public int getQuantity() {
    return quantity;
  }

  public String getNote() {
    return note;
  }

  public void setItemId(UUID itemId) {
    this.itemId = itemId;
  }

  public void setFromLocationId(UUID fromLocationId) {
    this.fromLocationId = fromLocationId;
  }

  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }

  public void setNote(String note) {
    this.note = note;
  }
}
