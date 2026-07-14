function StockMovementForm({
  items,
  movementItemId,
  movementType,
  movementQuantity,
  movementNote,
  onMovementItemIdChange,
  onMovementTypeChange,
  onMovementQuantityChange,
  onMovementNoteChange,
  onSubmit,
  canCreateStockMovements,
}) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Item: </label>
        <select
          value={movementItemId}
          onChange={(event) => onMovementItemIdChange(event.target.value)}
          disabled={!canCreateStockMovements}
        >
          <option value="">Select item</option>

          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} ({item.sku})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Type: </label>
        <select
          value={movementType}
          onChange={(event) => onMovementTypeChange(event.target.value)}
          disabled={!canCreateStockMovements}
        >
          <option value={"IN"}>IN</option>
          <option value={"OUT"}>OUT</option>
          <option value={"ADJUSTMENT"}>ADJUSTMENT</option>
        </select>
      </div>

      <div>
        <label>Quantity: </label>
        <input 
          type="number"
          value={movementQuantity}
          onChange={(event) => onMovementQuantityChange(event.target.value)}
          disabled={!canCreateStockMovements}
        />
      </div>

      <div>
        <label>Note: </label>
        <input 
          type="text"
          value={movementNote}
          onChange={(event) => onMovementNoteChange(event.target.value)}
          disabled={!canCreateStockMovements}
        />
      </div>

      <button type="submit" disabled={!canCreateStockMovements}>
        Add Movement
      </button>
    </form>
  );
}

export default StockMovementForm;