import { useState } from "react";
import StockTransferForm from "./StockTransferForm";
import StockTransferTable from "./StockTransferTable";

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
  currentUsername,
  canTransferStock,
  fetchItems,
  fetchInventoryBalances,
  fetchAuditLogs,
  setError,
}) {
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedFromLocationId, setSelectedFromLocationId] = useState("");
  const [selectedToLocationId, setSelectedToLocationId] = useState("");

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

  function clearFilters() {
    setSelectedItemId("");
    setSelectedFromLocationId("");
    setSelectedToLocationId("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    saveStockTransfer(currentUsername)
      .then(() => {
        setError("");
        fetchItems();
        fetchInventoryBalances();
        fetchAuditLogs();
      })
      .catch((error) => {
        setError(error.message);
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

      <button type="button" onClick={exportStockTransfers}>
        Export Stock Transfers CSV
      </button>

      <div>
        <label>Filter by item: </label>
        <select
          value={selectedItemId}
          onChange={(event) => setSelectedItemId(event.target.value)}
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
          onChange={(event) => setSelectedFromLocationId(event.target.value)}
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
          onChange={(event) => setSelectedToLocationId(event.target.value)}
        >
          <option value="">All destination locations</option>

          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.code} - {location.name}
            </option>
          ))}
        </select>
      </div>

      <button type="button" onClick={clearFilters}>
        Clear Transfer Filters
      </button>

      <StockTransferTable
        stockTransfers={filteredStockTransfers}
        items={items}
        locations={locations}
        emptyMessage="No stock transfers match the selected filters."
      />
    </>
  );
}

export default StockTransferSection;