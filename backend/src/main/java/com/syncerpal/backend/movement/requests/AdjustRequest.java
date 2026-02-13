package com.syncerpal.backend.movement.requests;

import java.util.UUID;

public class AdjustRequest {
  private UUID itemId;
  private UUID locationId;
  private int quantity;
  private String direction; // For increase or decrease
  private String note;

  public AdjustRequest() {
  }

  public UUID getItemId() {
    return itemId;
  }

  public UUID getLocationId() {
    return locationId;
  }

  public int getQuantity() {
    return quantity;
  }

  public String getDirection() {
    return direction;
  }

  public String getNote() {
    return note;
  }

  public void setItemId(UUID itemId) {
    this.itemId = itemId;
  }

  public void setLocationId(UUID locationId) {
    this.locationId = locationId;
  }

  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }

  public void setDirection(String direction) {
    this.direction = direction;
  }

  public void setNote(String note) {
    this.note = note;
  }
}
