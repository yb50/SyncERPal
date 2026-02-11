package com.syncerpal.backend.inventory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "inventory_balances")
public class InventoryBalance {

  @Id
  private UUID id;

  @Column(name = "item_id")
  private UUID itemId;

  @Column(name = "location_id")
  private UUID locationId;

  @Column(name = "quantity")
  private int quantity;

  public InventoryBalance() {
  }

  // Get
  public UUID getId() {
    return id;
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

  // Set
  public void setId(UUID id) {
    this.id = id;
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
}
