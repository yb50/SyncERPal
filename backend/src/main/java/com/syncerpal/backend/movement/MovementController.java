package com.syncerpal.backend.movement;

import com.syncerpal.backend.inventory.InventoryBalance;
import com.syncerpal.backend.movement.requests.AdjustRequest;
import com.syncerpal.backend.movement.requests.StockOutRequest;
import com.syncerpal.backend.movement.requests.TransferRequest;
import com.syncerpal.backend.user.UserRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import com.syncerpal.backend.movement.StockMovementRepository;

import java.time.Instant;
import java.util.UUID;

import static com.syncerpal.backend.movement.StockMovementSpecs.*;
import org.springframework.data.jpa.domain.Specification;

import com.syncerpal.backend.user.User;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class MovementController {

    private final MovementService movementService;
    private final StockMovementRepository stockMovementRepository;
    private final UserRepository userRepository;

    public MovementController(
            MovementService movementService,
            StockMovementRepository stockMovementRepository,
            UserRepository userRepository) {
        this.movementService = movementService;
        this.stockMovementRepository = stockMovementRepository;
        this.userRepository = userRepository;
    }

    // --- IN (updated to include note) ---
    @PreAuthorize("hasAnyRole('ADMIN','WORKER')")
    @PostMapping("/api/movements/in")
    public InventoryBalance stockIn(@RequestBody StockInRequest request) {
        return movementService.stockIn(
                request.getItemId(),
                request.getToLocationId(),
                request.getQuantity(),
                request.getNote());
    }

    // --- OUT ---
    @PreAuthorize("hasAnyRole('ADMIN','WORKER')")
    @PostMapping("/api/movements/out")
    public InventoryBalance stockOut(@RequestBody StockOutRequest request) {
        return movementService.stockOut(
                request.getItemId(),
                request.getFromLocationId(),
                request.getQuantity(),
                request.getNote());
    }

    // --- TRANSFER ---
    @PreAuthorize("hasAnyRole('ADMIN','WORKER')")
    @PostMapping("/api/movements/transfer")
    public String transfer(@RequestBody TransferRequest request) {
        movementService.transfer(
                request.getItemId(),
                request.getFromLocationId(),
                request.getToLocationId(),
                request.getQuantity(),
                request.getNote());
        return "OK";
    }

    // --- ADJUST ---
    @PreAuthorize("hasAnyRole('ADMIN','WORKER')")
    @PostMapping("/api/movements/adjust")
    public InventoryBalance adjust(@RequestBody AdjustRequest request) {
        return movementService.adjust(
                request.getItemId(),
                request.getLocationId(),
                request.getQuantity(),
                request.getDirection(),
                request.getNote());
    }

    // --- MOVEMENT HISTORY ---
  @PreAuthorize("hasAnyRole('ADMIN','WORKER')")
@GetMapping("/api/movements")
public Page<StockMovement> listMovements(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,

        @RequestParam(required = false) String type,
        @RequestParam(required = false) UUID itemId,
        @RequestParam(required = false) UUID locationId,

        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        Instant from,

        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        Instant to
) {
    // Sort newest first
    PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

    Specification<StockMovement> spec = Specification
            .where(hasType(type))
            .and(hasItemId(itemId))
            .and(hasLocationId(locationId))
            .and(createdAtFrom(from))
            .and(createdAtTo(to));

    Page<StockMovement> pageResult = stockMovementRepository.findAll(spec, pageable);

    // Collect unique user IDs from this page
    List<UUID> userIds = pageResult.getContent().stream()
        .map(StockMovement::getCreatedByUserId)
        .filter(java.util.Objects::nonNull)
        .distinct()
        .toList();

    if (!userIds.isEmpty()) {
      // Fetch all users in one query
      Map<UUID, String> idToUsername = userRepository.findAllByIdIn(userIds).stream()
          .collect(java.util.stream.Collectors.toMap(User::getId, User::getUsername));

      // Fill the transient field
      pageResult.getContent().forEach(m -> {
        if (m.getCreatedByUserId() != null) {
          m.setCreatedByUsername(idToUsername.get(m.getCreatedByUserId()));
        }
      });
    }

    return pageResult;
}
}