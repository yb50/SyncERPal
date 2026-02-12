package com.syncerpal.backend.movement;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "stock_movements")
public class StockMovement {

    @Id
    private UUID id;

    @Column(name = "reference_no")
    private String referenceNo;

    @Column(name = "type")
    private String type;

    @Column(name = "item_id")
    private UUID itemId;

    @Column(name = "from_location_id")
    private UUID fromLocationId;

    @Column(name = "to_location_id")
    private UUID toLocationId;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "note")
    private String note;

    @Column(name = "created_by_user_id")
    private UUID createdByUserId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public StockMovement() {}

    public UUID getId() { return id; }
    public String getReferenceNo() { return referenceNo; }
    public String getType() { return type; }
    public UUID getItemId() { return itemId; }
    public UUID getFromLocationId() { return fromLocationId; }
    public UUID getToLocationId() { return toLocationId; }
    public int getQuantity() { return quantity; }
    public String getNote() { return note; }
    public UUID getCreatedByUserId() { return createdByUserId; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(UUID id) { this.id = id; }
    public void setReferenceNo(String referenceNo) { this.referenceNo = referenceNo; }
    public void setType(String type) { this.type = type; }
    public void setItemId(UUID itemId) { this.itemId = itemId; }
    public void setFromLocationId(UUID fromLocationId) { this.fromLocationId = fromLocationId; }
    public void setToLocationId(UUID toLocationId) { this.toLocationId = toLocationId; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public void setNote(String note) { this.note = note; }
    public void setCreatedByUserId(UUID createdByUserId) { this.createdByUserId = createdByUserId; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}