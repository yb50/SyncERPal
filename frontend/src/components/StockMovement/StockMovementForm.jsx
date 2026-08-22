function StockMovementForm({
  items,
  locations,
  movementItemId,
  movementLocationId,
  movementType,
  movementQuantity,
  movementNote,
  onMovementItemIdChange,
  onLocationIdChange,
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
          required
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
        <label>Location: </label>
        <select
          value={movementLocationId}
          onChange={(event) => onLocationIdChange(event.target.value)}
          disabled={!canCreateStockMovements}
          required
        >
          <option value="">Select location</option>

          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.code} - {location.name}
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
          required
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
          required
          min="1"
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