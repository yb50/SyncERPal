function ItemForm({ name, sku, editingId, onNameChange, onSkuChange, quantity, onQuantityChange, lowStockThreshold, onLowStockThreshold, onSubmit, onCancelEdit, canManageItems }) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Name: </label>
        <input
          type="text"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          disabled={!canManageItems}
        />
      </div>

      <div>
        <label>SKU: </label>
        <input
          type="text"
          value={sku}
          onChange={(event) => onSkuChange(event.target.value)}
          disabled={!canManageItems}
        />
      </div>

      <div>
        <label>Quantity: </label>
        <input
          type="number"
          value={quantity}
          onChange={(event) => onQuantityChange(event.target.value)}
          disabled={!canManageItems || editingId !== null}
        />

        {editingId !== null && (
          <p className="hint">
            Use stock movements to change quantity.
          </p>
        )}
      </div>

      <div>
        <label>Low Stock Threshold: </label>
        <input 
          type="number"
          value={lowStockThreshold}
          onChange={(event) => onLowStockThreshold(event.target.value)}
          disabled={!canManageItems}
        />
      </div>

      <button type="submit" disabled={!canManageItems}>
        {editingId === null ? "Add Item" : "Update Item"}
      </button>

      {editingId !== null && (
        <button type="button" onClick={onCancelEdit}>
          Cancel
        </button>
      )}
    </form>
  )
}

export default ItemForm;