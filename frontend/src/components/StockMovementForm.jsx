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
}) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Item: </label>
        <select
          value={movementItemId}
          onChange={(event) => onMovementItemIdChange(event.target.value)}
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
        />
      </div>

      <div>
        <label>Note: </label>
        <input 
          type="text"
          value={movementNote}
          onChange={(event) => onMovementNoteChange(event.target.value)}
        />
      </div>

      <button type="submit">Add Movement</button>
    </form>
  );
}

export default StockMovementForm;