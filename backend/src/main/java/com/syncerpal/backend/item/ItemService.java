package com.syncerpal.backend.item;

import com.syncerpal.backend.inventory.InventoryBalance;
import com.syncerpal.backend.inventory.InventoryBalanceRepository;
import com.syncerpal.backend.location.Location;
import com.syncerpal.backend.location.LocationRepository;
import com.syncerpal.backend.item.requests.CreateItemRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ItemService {

  private final ItemRepository itemRepository;
  private final LocationRepository locationRepository;
  private final InventoryBalanceRepository inventoryBalanceRepository;

  public ItemService(
      ItemRepository itemRepository,
      LocationRepository locationRepository,
      InventoryBalanceRepository inventoryBalanceRepository) {
    this.itemRepository = itemRepository;
    this.locationRepository = locationRepository;
    this.inventoryBalanceRepository = inventoryBalanceRepository;
  }

  @Transactional
  public Item createItemAndSeedBalances(CreateItemRequest request) {

    // Basic validation
    if (request.getSku() == null || request.getSku().isBlank()) {
      throw new IllegalArgumentException("SKU is required");
    }
    if (request.getNameEn() == null || request.getNameEn().isBlank()) {
      throw new IllegalArgumentException("English name is required");
    }
    if (request.getNameJa() == null || request.getNameJa().isBlank()) {
      throw new IllegalArgumentException("Japanese name is required");
    }

    // Create item
    Item item = new Item();
    item.setId(UUID.randomUUID());
    item.setSku(request.getSku());
    item.setNameEn(request.getNameEn());
    item.setNameJa(request.getNameJa());
    item.setBarcode(request.getBarcode());
    item.setUnit((request.getUnit() == null || request.getUnit().isBlank()) ? "pcs" : request.getUnit());
    item.setLowStockThreshold(request.getLowStockThreshold());
    item.setActive(true);

    Item savedItem = itemRepository.save(item);

    // Create inventory balance row for each location
    List<Location> locations = locationRepository.findAll();

    for (Location loc : locations) {
      boolean exists = inventoryBalanceRepository.existsByItemIdAndLocationId(savedItem.getId(), loc.getId());
      if (!exists) {
        InventoryBalance bal = new InventoryBalance();
        bal.setId(UUID.randomUUID());
        bal.setItemId(savedItem.getId());
        bal.setLocationId(loc.getId());
        bal.setQuantity(0);
        inventoryBalanceRepository.save(bal);
      }
    }

    return savedItem;
  }
}
