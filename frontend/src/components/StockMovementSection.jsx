import StockMovementForm from "./StockMovementForm";
import StockMovementTable from "./StockMovementTable";

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
}) {
  function handleStockMovementSubmit(event) {
    event.preventDefault();

    saveStockMovement(currentUsername)
      .then(() => {
        setError("");
        fetchAuditLogs();
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
          onChange={(event) => {
            changeMovementFilterItemId(event.target.value)
              .then(() => {
                setError("");
              })
              .catch((error) => {
                setError(error.message);
              });
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

      <StockMovementTable
        stockMovements={stockMovements}
        items={items}
        locations={locations}
      />
    </>
  );
}

export default StockMovementSection;