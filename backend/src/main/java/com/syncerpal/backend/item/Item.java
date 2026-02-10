package com.syncerpal.backend.item;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "items")
public class Item {

  @Id
  private UUID id;

  @Column(name = "sku")
  private String sku;

  @Column(name = "name_en")
  private String nameEn;

  @Column(name = "name_ja")
  private String nameJa;

  @Column(name = "barcode")
  private String barcode;

  @Column(name = "unit")
  private String unit;

  @Column(name = "low_stock_threshold")
  private int lowStockThreshold;

  @Column(name = "is_active")
  private boolean active;

  public Item() {}

  // Get
  public UUID getId() {
    return id;
  }

  public String getSku() {
    return sku;
  }

  public String getNameEn() {
    return nameEn;
  }

  public String getNameJa() {
    return nameJa;
  }

  public String getBarcode() {
    return barcode;
  }

  public String getUnit() {
    return unit;
  }

  public int getLowStockThreshold() {
    return lowStockThreshold;
  }

  public boolean isActive() {
    return active;
  }

  // Set
  public void setId(UUID id) {
    this.id = id;
  }

  public void setSku(String sku) {
    this.sku = sku;
  }

  public void setNameEn(String nameEn) {
    this.nameEn = nameEn;
  }

  public void setNameJa(String nameJa) {
    this.nameJa = nameJa;
  }

  public void setBarcode(String barcode) {
    this.barcode = barcode;
  }

  public void setUnit(String unit) {
    this.unit = unit;
  }

  public void setLowStockThreshold(int lowStockThreshold) {
    this.lowStockThreshold = lowStockThreshold;
  }

  public void setActive(boolean active) {
    this.active = active;
  }
}
