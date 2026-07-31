import StockTransferForm from "./StockTransferForm";
import StockTransferTable from "./StockTransferTable";

function StockTransferSection({
  items,
  locations,
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
  currentUsername,
  canTransferStock,
  fetchItems,
  fetchInventoryBalances,
  fetchAuditLogs,
  setError,
  stockTransfers,
}) {
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

      <StockTransferTable 
        stockTransfers={stockTransfers}
        items={items}
        locations={locations}
      />
    </>
  );
}

export default StockTransferSection;