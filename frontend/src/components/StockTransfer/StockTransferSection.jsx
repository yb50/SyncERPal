import { useMemo, useState } from "react";
import StockTransferForm from "./StockTransferForm";
import StockTransferTable from "./StockTransferTable";
import PaginationControls from "../PaginationControls";
import SortControls from "../SortControls";

function StockTransferSection({
  items,
  locations,
  stockTransfers,
  transferItemId,
  fromLocationId,
  toLocationId,
  transferQuantity,
  transferNote,
  setTransferItemId,
  setFromLocationId,
  setToLocationId,
  setTransferQuantity,
  setTransferNote,
  saveStockTransfer,
  exportStockTransfers,
  canTransferStock,
  fetchItems,
  fetchInventoryBalances,
  fetchAuditLogs,
  setError,
  handleApiError,
  setSuccessMessage,
  authToken,
}) {
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedFromLocationId, setSelectedFromLocationId] = useState("");
  const [selectedToLocationId, setSelectedToLocationId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  const pageSize = 10;

  // + Filtering

  const filteredStockTransfers = stockTransfers.filter((stockTransfer) => {
    const matchesItem =
      selectedItemId === "" ||
      String(stockTransfer.itemId) === selectedItemId;

    const matchesFromLocation =
      selectedFromLocationId === "" ||
      String(stockTransfer.fromLocationId) === selectedFromLocationId;

    const matchesToLocation =
      selectedToLocationId === "" ||
      String(stockTransfer.toLocationId) === selectedToLocationId;

    return matchesItem && matchesFromLocation && matchesToLocation;
  });

  // - Filtering

  // + Sorting

  function getItemSortText(stockTransfer) {
    const item = items.find((item) => item.id === Number(stockTransfer.itemId));

    if (!item) {
      return "";
    }

    return `${item.name} ${item.sku}`.toLowerCase();
  }

  function getLocationSortText(locationId) {
    const location = locations.find(
      (location) => location.id === Number(locationId)
    );

    if (!location) {
      return "";
    }

    return `${location.code} ${location.name}`.toLowerCase();
  }

  function getStockTransferSortValue(stockTransfer) {
    switch (sortBy) {
      case "item":
        return getItemSortText(stockTransfer);
      case "fromLocation":
        return getLocationSortText(stockTransfer.fromLocationId);
      case "toLocation":
        return getLocationSortText(stockTransfer.toLocationId);
      case "quantity":
        return stockTransfer.quantity ?? 0;
      case "performedBy":
        return stockTransfer.performedBy ?? "";
      case "createdAt":
        return stockTransfer.createdAt
          ? new Date(stockTransfer.createdAt).getTime()
          : 0;
      default:
        return stockTransfer.createdAt
          ? new Date(stockTransfer.createdAt).getTime()
          : 0;
    }
  }

  const sortedStockTransfers = useMemo(() => {
    return [...filteredStockTransfers].sort((a, b) => {
      const aValue = getStockTransferSortValue(a);
      const bValue = getStockTransferSortValue(b);

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
  }, [filteredStockTransfers, sortBy, sortDirection, items, locations]);

  // - Sorting

  // + Pagination

  const totalPages = Math.ceil(sortedStockTransfers.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;

  const paginatedStockTransfers = sortedStockTransfers.slice(
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

  function clearFilters() {
    setSelectedItemId("");
    setSelectedFromLocationId("");
    setSelectedToLocationId("");
    setCurrentPage(1);
  }

  function handleSubmit(event) {
    event.preventDefault();

    saveStockTransfer(authToken)
      .then(() => {
        setError("");
        setSuccessMessage("Stock transfer completed successfully.");
        fetchItems(authToken);
        fetchInventoryBalances(authToken);
        fetchAuditLogs(authToken);
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  return (
    <>
      <h2>Transfer Stock</h2>

      {!canTransferStock && (
        <p className="hint">Select a real app user before transferring stock.</p>
      )}

      <StockTransferForm
        items={items}
        locations={locations}
        transferItemId={transferItemId}
        fromLocationId={fromLocationId}
        toLocationId={toLocationId}
        transferQuantity={transferQuantity}
        transferNote={transferNote}
        onTransferItemIdChange={setTransferItemId}
        onFromLocationIdChange={setFromLocationId}
        onToLocationIdChange={setToLocationId}
        onTransferQuantityChange={setTransferQuantity}
        onTransferNoteChange={setTransferNote}
        onSubmit={handleSubmit}
        canTransferStock={canTransferStock}
      />

      <h2>Stock Transfer History</h2>

      <button type="button" onClick={() => exportStockTransfers(authToken)}>
        Export Stock Transfers CSV
      </button>

      <div>
        <label>Filter by item: </label>
        <select
          value={selectedItemId}
          onChange={(event) => {
            setSelectedItemId(event.target.value);
            resetToFirstPage();
          }}
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
        <label>Filter by from location: </label>
        <select
          value={selectedFromLocationId}
          onChange={(event) => {
            setSelectedFromLocationId(event.target.value);
            resetToFirstPage();
          }}
        >
          <option value="">All source locations</option>

          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.code} - {location.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Filter by to location: </label>
        <select
          value={selectedToLocationId}
          onChange={(event) => {
            setSelectedToLocationId(event.target.value);
            resetToFirstPage();
          }}
        >
          <option value="">All destination locations</option>

          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.code} - {location.name}
            </option>
          ))}
        </select>
      </div>

      <SortControls
        sortBy={sortBy}
        sortDirection={sortDirection}
        sortOptions={[
          { value: "createdAt", label: "Created at" },
          { value: "item", label: "Item" },
          { value: "fromLocation", label: "From location" },
          { value: "toLocation", label: "To location" },
          { value: "quantity", label: "Quantity" },
          { value: "performedBy", label: "Performed by" },
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

      <button type="button" onClick={clearFilters}>
        Clear Transfer Filters
      </button>

      <p className="table-summary">
        Showing {paginatedStockTransfers.length} of {filteredStockTransfers.length} stock transfers
      </p>

      <StockTransferTable
        stockTransfers={paginatedStockTransfers}
        items={items}
        locations={locations}
        emptyMessage="No stock transfers match the selected filters."
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

export default StockTransferSection;