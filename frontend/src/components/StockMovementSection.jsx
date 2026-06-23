import StockMovementForm from "./StockMovementForm";
import StockMovementTable from "./StockMovementTable";

function StockMovementSection({
  items,
  stockMovements,
  movementItemId,
  movementType,
  movementQuantity,
  movementNote,
  movementFilterItemId,
  setMovementItemId,
  setMovementType,
  setMovementQuantity,
  setMovementNote,
  changeMovementFilterItemId,
  saveStockMovement,
  setError,
}) {
  function handleStockMovementSubmit(event) {
    event.preventDefault();

    saveStockMovement()
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

      <StockMovementForm
        items={items}
        movementItemId={movementItemId}
        movementType={movementType}
        movementQuantity={movementQuantity}
        movementNote={movementNote}
        onMovementItemIdChange={setMovementItemId}
        onMovementTypeChange={setMovementType}
        onMovementQuantityChange={setMovementQuantity}
        onMovementNoteChange={setMovementNote}
        onSubmit={handleStockMovementSubmit}
      />

      <h2>Stock Movements</h2>

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
      />
    </>
  );
}

export default StockMovementSection;