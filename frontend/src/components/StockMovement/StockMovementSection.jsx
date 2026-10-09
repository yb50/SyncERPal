import { useMemo, useState } from "react";
import StockMovementForm from "./StockMovementForm";
import StockMovementTable from "./StockMovementTable";
import PaginationControls from "../PaginationControls";
import SortControls from "../SortControls";
import PageToolbar from "../PageToolbar";

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
  handleApiError,
  exportStockMovements,
  fetchInventoryBalances,
  setSuccessMessage,
  authToken,
}) {
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [selectedMovementType, setSelectedMovementType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  const pageSize = 10;

  // + Filtering
  
  const filteredStockMovements = stockMovements.filter((stockMovement) => {
    const matchesLocation =
      selectedLocationId === "" ||
      String(stockMovement.locationId) === selectedLocationId;

    const matchesType =
      selectedMovementType === "" ||
      stockMovement.type === selectedMovementType;

    return matchesLocation && matchesType;
  });

  // - Filtering

  // + Sorting

  function getItemSortText(stockMovement) {
    const item = items.find((item) => item.id === Number(stockMovement.itemId));

    if (!item) {
      return "";
    }

    return `${item.name} ${item.sku}`.toLowerCase();
  }

  function getLocationSortText(stockMovement) {
    const location = locations.find(
      (location) => location.id === Number(stockMovement.locationId)
    );

    if (!location) {
      return "";
    }

    return `${location.code} ${location.name}`.toLowerCase();
  }

  function getStockMovementSortValue(stockMovement) {
    switch (sortBy) {
      case "item":
        return getItemSortText(stockMovement);
      case "location":
        return getLocationSortText(stockMovement);
      case "type":
        return stockMovement.type ?? "";
      case "quantity":
        return stockMovement.quantity ?? 0;
      case "createdAt":
        return stockMovement.createdAt
          ? new Date(stockMovement.createdAt).getTime()
          : 0;
      default:
        return stockMovement.createdAt
          ? new Date(stockMovement.createdAt).getTime()
          : 0;
    }
  }

  const sortedStockMovements = useMemo(() => {
    return [...filteredStockMovements].sort((a, b) => {
      const aValue = getStockMovementSortValue(a);
      const bValue = getStockMovementSortValue(b);

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      const aText = String(aValue).toLowerCase();
      const bText = String(bValue).toLowerCase();

      return sortDirection === "asc"
        ? aText.localeCompare(bText)
        : bText.localeCompare(aText);
    });
  }, [filteredStockMovements, sortBy, sortDirection, items, locations]);

  // - Sorting

  // + Pagination

  const totalPages = Math.ceil(sortedStockMovements.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;

  const paginatedStockMovements = sortedStockMovements.slice(
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

    saveStockMovement(authToken)
      .then(() => {
        setError("");
        setSuccessMessage("Stock movement created successfully.");
        fetchAuditLogs(authToken);
        fetchInventoryBalances(authToken);
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  function handleItemFilterChange(itemId) {
    resetToFirstPage();

    changeMovementFilterItemId(itemId, authToken)
      .then(() => {
        setError("");
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  function clearFilters() {
    setSelectedLocationId("");
    setSelectedMovementType("");
    resetToFirstPage();

    changeMovementFilterItemId("", authToken)
      .then(() => {
        setError("");
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  function handleExportStockMovements() {
    exportStockMovements(authToken)
      .then(() => {
        setError("");
      })
      .catch((error) => {
        handleApiError(error);
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

      <PageToolbar
        actions={
          <button type="button" onClick={handleExportStockMovements}>
            Export Stock Movements CSV
          </button>
        }
      >
        <label>
          Item:
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
        </label>

        <label>
          Location:
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
        </label>

        <label>
          Type:
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
        </label>

        <button type="button" onClick={clearFilters}>
          Clear Filters
        </button>

        <SortControls
          sortBy={sortBy}
          sortDirection={sortDirection}
          sortOptions={[
            { value: "createdAt", label: "Created at" },
            { value: "item", label: "Item" },
            { value: "location", label: "Location" },
            { value: "type", label: "Type" },
            { value: "quantity", label: "Quantity" },
          ]}
          onSortByChange={(value) => {
            setSortBy(value);
            setCurrentPage(1);
          }}
          onSortDirectionChange={(value) => {
            setSortDirection(value);
            setCurrentPage(1);
          }}
        />
      </PageToolbar>

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