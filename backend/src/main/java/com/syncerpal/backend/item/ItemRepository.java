package com.syncerpal.backend.item;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface ItemRepository extends JpaRepository<Item, UUID> {

  Optional<Item> findBySku(String sku);

  // Maybe an idea for later
  Optional<Item> findByBarcode(String barcode);
}
