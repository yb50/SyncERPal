package com.yb.SyncERPal.model;

public class Item {

    private long id;
    private String name;
    private String sku;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSku() {
        return sku;
    }

    // Temporary
    public void setSku(String sku) {
        this.sku = sku;
    }

    public Item(Long id, String name, String sku) {
        this.id = id;
        this.name = name;
        this.sku = sku;
    }
}
