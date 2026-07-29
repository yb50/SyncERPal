function StockTransferForm({
  items,
  locations,
  transferItemId,
  fromLocationId,
  toLocationId,
  transferQuantity,
  transferNote,
  onTransferItemIdChange,
  onFromLocationIdChange,
  onToLocationIdChange,
  onTransferQuantityChange,
  onTransferNoteChange,
  onSubmit,
  canTransferStock,
}) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Item: </label>
        <select
          value={transferItemId}
          onChange={(event) => onTransferItemIdChange(event.target.value)}
          disabled={!canTransferStock}
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
        <label>From Location: </label>
        <select
          value={fromLocationId}
          onChange={(event) => onFromLocationIdChange(event.target.value)}
          disabled={!canTransferStock}
        >
          <option value="">Select source location</option>

          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.code} - {location.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>To Location: </label>
        <select
          value={toLocationId}
          onChange={(event) => onToLocationIdChange(event.target.value)}
          disabled={!canTransferStock}
        >
          <option value="">Select destination location</option>

          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.code} - {location.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Quantity: </label>
        <input
          type="number"
          value={transferQuantity}
          onChange={(event) => onTransferQuantityChange(event.target.value)}
          disabled={!canTransferStock}
        />
      </div>

      <div>
        <label>Note: </label>
        <input
          type="text"
          value={transferNote}
          onChange={(event) => onTransferNoteChange(event.target.value)}
          disabled={!canTransferStock}
        />
      </div>

      <button type="submit" disabled={!canTransferStock}>
        Transfer Stock
      </button>
    </form>
  );
}

export default StockTransferForm;