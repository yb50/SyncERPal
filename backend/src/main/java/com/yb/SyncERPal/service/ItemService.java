package com.yb.SyncERPal.service;

import com.yb.SyncERPal.model.Item;
import com.yb.SyncERPal.repository.ItemRepository;
import com.yb.SyncERPal.repository.StockMovementRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final StockMovementRepository stockMovementRepository;

    public ItemService(
            ItemRepository itemRepository,
            StockMovementRepository stockMovementRepository
    ) {
        this.itemRepository = itemRepository;
        this.stockMovementRepository = stockMovementRepository;
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item getItem(Long id) {
        return itemRepository.findItem(id);
    }

    private void validateItem(Item item) {
        if (item.getName() == null || item.getName().isBlank()) {
            throw new IllegalArgumentException("Item name is required");
        }

        if (item.getSku() == null || item.getSku().isBlank()) {
            throw new IllegalArgumentException("Item SKU is required");
        }

        if (item.getQuantity() == null || item.getQuantity() < 0) {
            throw new IllegalArgumentException("Item quantity must be 0 or higher.");
        }

        if (item.getLowStockThreshold() == null || item.getLowStockThreshold() < 0) {
            throw new IllegalArgumentException("Low stock threshold must be 0 or higher.");
        }
    }

    public Item createItem(Item item) {
        validateItem(item);

        if (itemRepository.existsBySku(item.getSku())) {
            throw new IllegalArgumentException("Item SKU already exists.");
        }

        return itemRepository.save(item);
    }

    public Item updateItem(Long id, Item item) {
        validateItem(item);

        Item existingItem = itemRepository.findItem(id);

        if (existingItem == null) {
            return null;
        }

        boolean skuChanged = !existingItem.getSku().equals(item.getSku());

        if (skuChanged && itemRepository.existsBySku(item.getSku())) {
            throw new IllegalArgumentException("Item SKU already exists.");
        }

        return itemRepository.updateItem(id, item);
    }

    public Item deleteItem(Long id) {
        Item existingItem = itemRepository.findItem(id);

        if (existingItem == null) {
            return null;
        }

        if (stockMovementRepository.existsByItemId(id)) {
            throw new IllegalStateException("Cannot delete item with stock movement history");
        }

        return itemRepository.deleteItem(id);
    }

    public String exportItemsAsCsv() {
        List<Item> items = itemRepository.findAll();

        StringBuilder csv = new StringBuilder();

        csv.append("id,sku,name,quantity,lowStockThreshold,createdAt,updatedAt\n");

        for (Item item : items) {
            csv.append(item.getId()).append(",");
            csv.append(escapeCsv(item.getSku())).append(",");
            csv.append(escapeCsv(item.getName())).append(",");
            csv.append(item.getQuantity()).append(",");
            csv.append(item.getLowStockThreshold()).append(",");
            csv.append(item.getCreatedAt()).append(",");
            csv.append(item.getUpdatedAt()).append("\n");
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

    @Transactional
    public int importItemsFromCsv(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("CSV file is required.");
        }

        int importedCount = 0;

        try (
                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8)
                );
                CSVParser csvParser = CSVFormat.DEFAULT.builder()
                        .setHeader()
                        .setSkipHeaderRecord(true)
                        .setTrim(true)
                        .get()
                        .parse(reader)
        ) {
            for (CSVRecord record : csvParser) {
                Item item = new Item();

                item.setSku(getRequiredText(record, "sku"));
                item.setName(getRequiredText(record, "name"));
                item.setQuantity(parseInteger(record, "quantity"));
                item.setLowStockThreshold(parseInteger(record, "lowStockThreshold"));

                createItem(item);

                importedCount++;
            }

            return importedCount;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to import CSV: " + e.getMessage());
        }
    }

    private String getRequiredText(CSVRecord record, String columnName) {
        String value = record.get(columnName);

        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                    "Row " + record.getRecordNumber() + ": " + columnName + " is required."
            );
        }

        return value;
    }

    private Integer parseInteger(CSVRecord record, String columnName) {
        String value = record.get(columnName);

        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                    "Row " + record.getRecordNumber() + ": " + columnName + " is required."
            );
        }

        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException(
                    "Row " + record.getRecordNumber() + ": " + columnName + " must be a number."
            );
        }
    }
}