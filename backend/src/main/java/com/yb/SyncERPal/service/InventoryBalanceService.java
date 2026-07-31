package com.yb.SyncERPal.service;

import com.yb.SyncERPal.model.InventoryBalance;
import com.yb.SyncERPal.model.InventoryLocation;
import com.yb.SyncERPal.model.Item;
import com.yb.SyncERPal.repository.InventoryBalanceRepository;
import com.yb.SyncERPal.repository.InventoryLocationRepository;
import com.yb.SyncERPal.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryBalanceService {

    private final InventoryBalanceRepository inventoryBalanceRepository;
    private final ItemRepository itemRepository;
    private final InventoryLocationRepository inventoryLocationRepository;

    public InventoryBalanceService(
            InventoryBalanceRepository inventoryBalanceRepository,
            ItemRepository itemRepository,
            InventoryLocationRepository inventoryLocationRepository
    ) {
        this.inventoryBalanceRepository = inventoryBalanceRepository;
        this.itemRepository = itemRepository;
        this.inventoryLocationRepository = inventoryLocationRepository;
    }

    public List<InventoryBalance> getAllBalances() {
        return inventoryBalanceRepository.findAll();
    }

    public InventoryBalance getOrCreateBalance(Long itemId, Long locationId) {
        InventoryBalance inventoryBalance =
                inventoryBalanceRepository.findByItemIdAndLocationId(itemId, locationId);

        if (inventoryBalance != null) {
            return inventoryBalance;
        }

        InventoryBalance newBalance = new InventoryBalance(itemId, locationId, 0);

        return inventoryBalanceRepository.save(newBalance);
    }

    public InventoryBalance updateBalance(Long itemId, Long locationId, Integer newQuantity) {
        InventoryBalance inventoryBalance = getOrCreateBalance(itemId, locationId);

        inventoryBalance.setQuantity(newQuantity);

        return inventoryBalanceRepository.save(inventoryBalance);
    }

    public Integer getTotalQuantityForItem(Long itemId) {
        return inventoryBalanceRepository.findByItemId(itemId)
                .stream()
                .mapToInt(InventoryBalance::getQuantity)
                .sum();
    }

    public String exportInventoryBalancesAsCsv() {
        StringBuilder csv = new StringBuilder();

        csv.append("itemId,itemSku,itemName,locationId,locationCode,locationName,quantity\n");

        for (InventoryBalance inventoryBalance : getAllBalances()) {
            Item item = itemRepository.findItem(inventoryBalance.getItemId());
            InventoryLocation location =
                    inventoryLocationRepository.findById(inventoryBalance.getLocationId());

            csv.append(inventoryBalance.getItemId()).append(",");
            csv.append(escapeCsv(item != null ? item.getSku() : "")).append(",");
            csv.append(escapeCsv(item != null ? item.getName() : "")).append(",");
            csv.append(inventoryBalance.getLocationId()).append(",");
            csv.append(escapeCsv(location != null ? location.getCode() : "")).append(",");
            csv.append(escapeCsv(location != null ? location.getName() : "")).append(",");
            csv.append(inventoryBalance.getQuantity()).append("\n");
        }

        return csv.toString();
    }

    private String escapeCsv(String value) {
        if (value == null) {
            return "";
        }

        String escapedValue = value.replace("\"", "\"\"");

        if (escapedValue.contains(",") || escapedValue.contains("\"") || escapedValue.contains("\n")) {
            return "\"" + escapedValue + "\"";
        }

        return escapedValue;
    }
}