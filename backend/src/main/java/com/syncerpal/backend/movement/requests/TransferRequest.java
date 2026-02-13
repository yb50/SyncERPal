package com.syncerpal.backend.movement.requests;

import java.util.UUID;

public class TransferRequest {
  private UUID itemId;
  private UUID fromLocationId;
  private UUID toLocationId;
  private int quantity;
  private String note;

  public TransferRequest() {
  }

  public UUID getItemId() {
    return itemId;
  }

  public UUID getFromLocationId() {
    return fromLocationId;
  }

  public UUID getToLocationId() {
    return toLocationId;
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

  public void setToLocationId(UUID toLocationId) {
    this.toLocationId = toLocationId;
  }

  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }

  public void setNote(String note) {
    this.note = note;
  }
}
