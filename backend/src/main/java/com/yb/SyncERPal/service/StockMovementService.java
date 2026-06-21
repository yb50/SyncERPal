package com.yb.SyncERPal.service;

import com.yb.SyncERPal.model.Item;
import com.yb.SyncERPal.model.StockMovement;
import com.yb.SyncERPal.repository.ItemRepository;
import com.yb.SyncERPal.repository.StockMovementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StockMovementService {

    private final StockMovementRepository stockMovementRepository;
    private final ItemRepository itemRepository;

    public StockMovementService(
            StockMovementRepository stockMovementRepository,
            ItemRepository itemRepository
    ) {
        this.stockMovementRepository = stockMovementRepository;
        this.itemRepository = itemRepository;
    }

    public List<StockMovement> getAllStockMovements() {
        return stockMovementRepository.findAll();
    }

    public List<StockMovement> getStockMovementsByItemId(Long itemId) {
        return stockMovementRepository.findByItemId(itemId);
    }

    private void validateStockMovement(StockMovement stockMovement) {
        if (stockMovement.getItemId() == null) {
            throw new IllegalArgumentException("Item id is required.");
        }

        if (stockMovement.getType() == null || stockMovement.getType().isBlank()) {
            throw new IllegalArgumentException("Movement type is required");
        }

        if (!stockMovement.getType().equals("IN") &&
                !stockMovement.getType().equals("OUT") &&
                !stockMovement.getType().equals("ADJUSTMENT")) {
            throw new IllegalArgumentException("Movement type must be IN, OUT, ADJUSTMENT.");
        }

        if (stockMovement.getQuantity() == null || stockMovement.getQuantity() <= 0) {
            throw new IllegalArgumentException("Movement quantity must be greater than 0.");
        }
    }

    @Transactional
    public StockMovement createStockMovement(StockMovement stockMovement) {
        validateStockMovement(stockMovement);

        Item item = itemRepository.findItem(stockMovement.getItemId());

        if (item == null) {
            throw new IllegalArgumentException("Item does not exist.");
        }

        Integer newQuantity = item.getQuantity();

        if (stockMovement.getType().equals("IN")) {
            newQuantity = item.getQuantity() + stockMovement.getQuantity();
        } else if (stockMovement.getType().equals("OUT")) {
            newQuantity = item.getQuantity() - stockMovement.getQuantity();
        } else if (stockMovement.getType().equals("ADJUSTMENT")) {
            newQuantity = stockMovement.getQuantity();
        }

        if (newQuantity < 0) {
            throw new IllegalArgumentException("Item quantity cannot go below 0.");
        }

        itemRepository.updateQuantity(item.getId(), newQuantity);

        return stockMovementRepository.save(stockMovement);
    }
}
