package com.syncerpal.backend.item.requests;

public class UpdateItemRequest {
  private String nameEn;
  private String nameJa;
  private String barcode;
  private String unit;
  private int lowStockThreshold;
  private boolean active;

  public UpdateItemRequest() {
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
