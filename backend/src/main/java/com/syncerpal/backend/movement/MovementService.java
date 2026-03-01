package com.syncerpal.backend.movement;

import com.syncerpal.backend.inventory.InventoryBalance;
import com.syncerpal.backend.inventory.InventoryBalanceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.syncerpal.backend.security.SecurityUtils;
import com.syncerpal.backend.user.User;
import com.syncerpal.backend.user.UserRepository;

import java.util.UUID;
import java.util.List;

@Service
public class MovementService {

  private final InventoryBalanceRepository inventoryBalanceRepository;
  private final StockMovementRepository stockMovementRepository;
  private final UserRepository userRepository;

  public MovementService(
      InventoryBalanceRepository inventoryBalanceRepository,
      StockMovementRepository stockMovementRepository,
      UserRepository userRepository) {
    this.inventoryBalanceRepository = inventoryBalanceRepository;
    this.stockMovementRepository = stockMovementRepository;
    this.userRepository = userRepository;
  }

  private String newReferenceNo() {
    return "TX-" + System.currentTimeMillis();
  }

  private InventoryBalance getBalance(UUID itemId, UUID locationId) {
    return inventoryBalanceRepository
        .findByItemIdAndLocationId(itemId, locationId)
        .orElseThrow(() -> new IllegalArgumentException("Balance row not found for item/location"));
  }

  private StockMovement saveMovement(
      String type,
      UUID itemId,
      UUID fromLocationId,
      UUID toLocationId,
      int quantity,
      String note) {
    StockMovement m = new StockMovement();
    m.setId(UUID.randomUUID());
    m.setReferenceNo(newReferenceNo());
    m.setType(type);
    m.setItemId(itemId);
    m.setFromLocationId(fromLocationId);
    m.setToLocationId(toLocationId);
    m.setQuantity(quantity);
    m.setNote(note);

    String username = SecurityUtils.getCurrentUsername();
    if (username != null) {
      User u = userRepository.findByUsername(username).orElse(null);
      if (u != null) {
        m.setCreatedByUserId(u.getId());
      }
    }

    return stockMovementRepository.save(m);
  }

  @Transactional
  public InventoryBalance stockIn(UUID itemId, UUID toLocationId, int quantity, String note) {
    if (quantity <= 0)
      throw new IllegalArgumentException("Quantity must be greater than 0");

    InventoryBalance toBal = getBalance(itemId, toLocationId);
    toBal.setQuantity(toBal.getQuantity() + quantity);
    inventoryBalanceRepository.save(toBal);

    saveMovement("IN", itemId, null, toLocationId, quantity, note);

    return toBal;
  }

  @Transactional
  public InventoryBalance stockOut(UUID itemId, UUID fromLocationId, int quantity, String note) {
    if (quantity <= 0)
      throw new IllegalArgumentException("Quantity must be greater than 0");

    InventoryBalance fromBal = getBalance(itemId, fromLocationId);
    if (fromBal.getQuantity() < quantity) {
      throw new IllegalArgumentException("Insufficient stock for OUT");
    }

    fromBal.setQuantity(fromBal.getQuantity() - quantity);
    inventoryBalanceRepository.save(fromBal);

    saveMovement("OUT", itemId, fromLocationId, null, quantity, note);

    return fromBal;
  }

  @Transactional
  public void transfer(UUID itemId, UUID fromLocationId, UUID toLocationId, int quantity, String note) {
    if (quantity <= 0)
      throw new IllegalArgumentException("Quantity must be greater than 0");
    if (fromLocationId.equals(toLocationId)) {
      throw new IllegalArgumentException("From and To locations must be different");
    }

    InventoryBalance fromBal = getBalance(itemId, fromLocationId);
    InventoryBalance toBal = getBalance(itemId, toLocationId);

    if (fromBal.getQuantity() < quantity) {
      throw new IllegalArgumentException("Insufficient stock for TRANSFER");
    }

    fromBal.setQuantity(fromBal.getQuantity() - quantity);
    toBal.setQuantity(toBal.getQuantity() + quantity);

    inventoryBalanceRepository.save(fromBal);
    inventoryBalanceRepository.save(toBal);

    saveMovement("TRANSFER", itemId, fromLocationId, toLocationId, quantity, note);
  }

  @Transactional
  public InventoryBalance adjust(UUID itemId, UUID locationId, int quantity, String direction, String note) {
    if (quantity <= 0)
      throw new IllegalArgumentException("Quantity must be greater than 0");
    if (direction == null)
      throw new IllegalArgumentException("Direction is required");

    InventoryBalance bal = getBalance(itemId, locationId);

    if ("INCREASE".equalsIgnoreCase(direction)) {
      bal.setQuantity(bal.getQuantity() + quantity);
    } else if ("DECREASE".equalsIgnoreCase(direction)) {
      if (bal.getQuantity() < quantity) {
        throw new IllegalArgumentException("Insufficient stock for ADJUST decrease");
      }
      bal.setQuantity(bal.getQuantity() - quantity);
    } else {
      throw new IllegalArgumentException("Direction must be INCREASE or DECREASE");
    }

    inventoryBalanceRepository.save(bal);

    saveMovement("ADJUST", itemId, locationId, null, quantity, note + " (" + direction + ")");

    return bal;
  }

  public List<StockMovement> getMovementHistory() {
    List<StockMovement> list = stockMovementRepository.findAll();

    for (StockMovement m : list) {
      if (m.getCreatedByUserId() != null) {
        userRepository.findById(m.getCreatedByUserId()).ifPresent(u -> {
          m.setCreatedByUsername(u.getUsername());
        });
      }
    }

    return list;
  }

}
