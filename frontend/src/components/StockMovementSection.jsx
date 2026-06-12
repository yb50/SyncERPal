import StockMovementForm from "./StockMovementForm";
import StockMovementTable from "./StockMovementTable";

function StockMovementSection({
  items,
  stockMovements,
  movementItemId,
  movementType,
  movementQuantity,
  movementNote,
  setMovementItemId,
  setMovementType,
  setMovementQuantity,
  setMovementNote,
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

      <StockMovementTable
        stockMovements={stockMovements}
        items={items}
      />
    </>
  );
}

export default StockMovementSection;