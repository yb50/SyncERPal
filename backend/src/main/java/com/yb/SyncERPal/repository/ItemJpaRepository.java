package com.yb.SyncERPal.repository;

import com.yb.SyncERPal.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemJpaRepository extends JpaRepository<Item, Long> {
    boolean existsBySku(String sku);
}
