package com.yb.SyncERPal.repository;

import com.yb.SyncERPal.model.InventoryLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryLocationJpaRepository extends JpaRepository<InventoryLocation, Long> {

    boolean existsByCode(String code);

    List<InventoryLocation> findAllByOrderByCodeAsc();
}