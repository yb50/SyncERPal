import { useState } from "react";
import StockMovementForm from "./StockMovementForm";
import StockMovementTable from "./StockMovementTable";
import PaginationControls from "../PaginationControls";

function StockMovementSection({
  items,
  locations,
  stockMovements,
  movementItemId,
  movementLocationId,
  movementType,
  movementQuantity,
  movementNote,
  movementFilterItemId,
  setMovementItemId,
  setMovementLocationId,
  setMovementType,
  setMovementQuantity,
  setMovementNote,
  changeMovementFilterItemId,
  fetchAuditLogs,
  canCreateStockMovements,
  saveStockMovement,
  setError,
  exportStockMovements,
  currentUsername,
  fetchInventoryBalances,
  setSuccessMessage,
}) {
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [selectedMovementType, setSelectedMovementType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const filteredStockMovements = stockMovements.filter((stockMovement) => {
    const matchesLocation =
      selectedLocationId === "" ||
      String(stockMovement.locationId) === selectedLocationId;

    const matchesType =
      selectedMovementType === "" ||
      stockMovement.type === selectedMovementType;

    return matchesLocation && matchesType;
  });

  // + Pagination

  const totalPages = Math.ceil(filteredStockMovements.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;

  const paginatedStockMovements = filteredStockMovements.slice(
    startIndex,
    startIndex + pageSize
  );

  function resetToFirstPage() {
    setCurrentPage(1);
  }

  function goToPreviousPage() {
    setCurrentPage((page) => Math.max(page - 1, 1));
  }

  function goToNextPage() {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  }

  // - Pagination

  function handleStockMovementSubmit(event) {
    event.preventDefault();

    saveStockMovement(currentUsername)
      .then(() => {
        setError("");
        setSuccessMessage("Stock movement created successfully.");
        fetchAuditLogs();
        fetchInventoryBalances();
      })
      .catch((error) => {
        setSuccessMessage("");
        setError(error.message);
      });
  }

  function handleItemFilterChange(itemId) {
    resetToFirstPage();

    changeMovementFilterItemId(itemId)
      .then(() => {
        setError("");
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function clearFilters() {
    setSelectedLocationId("");
    setSelectedMovementType("");
    resetToFirstPage(1);

    changeMovementFilterItemId("")
      .then(() => {
        setError("");
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <>
      <h2>Add Stock Movement</h2>

      {!canCreateStockMovements && (
        <p className="hint">
          Select a real app user before creating stock movements.
        </p>
      )}

      <StockMovementForm
        items={items}
        locations={locations}
        movementItemId={movementItemId}
        movementLocationId={movementLocationId}
        movementType={movementType}
        movementQuantity={movementQuantity}
        movementNote={movementNote}
        onMovementItemIdChange={setMovementItemId}
        onLocationIdChange={setMovementLocationId}
        onMovementTypeChange={setMovementType}
        onMovementQuantityChange={setMovementQuantity}
        onMovementNoteChange={setMovementNote}
        onSubmit={handleStockMovementSubmit}
        canCreateStockMovements={canCreateStockMovements}
      />

      <h2>Stock Movements</h2>

      <button type="button" onClick={exportStockMovements}>
        Export Stock Movements CSV
      </button>

      <div>
        <label>Filter by item: </label>

        <select
          value={movementFilterItemId}
          onChange={(event) => handleItemFilterChange(event.target.value)}
        >
          <option value="">All items</option>

          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} ({item.sku})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Filter by location: </label>

        <select
          value={selectedLocationId}
          onChange={(event) => {
            setSelectedLocationId(event.target.value);
            resetToFirstPage();
          }}
        >
          <option value="">All locations</option>

          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.code} - {location.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Filter by type: </label>

        <select
          value={selectedMovementType}
          onChange={(event) => {
            setSelectedMovementType(event.target.value);
            resetToFirstPage();
          }}
        >
          <option value="">All types</option>
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
          <option value="ADJUSTMENT">ADJUSTMENT</option>
        </select>
      </div>

      <button type="button" onClick={clearFilters}>
        Clear Movement Filters
      </button>

      <p className="table-summary">
          Showing {paginatedStockMovements.length} of {filteredStockMovements.length} stock movements
      </p>

      <StockMovementTable
        stockMovements={paginatedStockMovements}
        items={items}
        locations={locations}
        emptyMessage="No stock movements match the selected filters."
      />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPreviousPage={goToPreviousPage}
        onNextPage={goToNextPage}
      />
    </>
  );
}

export default StockMovementSection;