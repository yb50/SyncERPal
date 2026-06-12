package com.yb.SyncERPal.model;

import java.time.LocalDateTime;

public class StockMovement {

    private Long id;
    private Long itemId;
    private String type;
    private Integer quantity;
    private String note;
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public StockMovement() {
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public StockMovement(Long id, Long itemId, String type, Integer quantity, String note, LocalDateTime createdAt) {
        this.id = id;
        this.itemId = itemId;
        this.type = type;
        this.quantity = quantity;
        this.note = note;
        this.createdAt = createdAt;
    }
}
