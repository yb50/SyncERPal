function ItemForm({name, sku, editingId, onNameChange, onSkuChange, onSubmit, onCancelEdit}) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Name: </label>
        <input
          type="text"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
        />
      </div>

      <div>
        <label>SKU: </label>
        <input
          type="text"
          value={sku}
          onChange={(event) => onSkuChange(event.target.value)}
        />
      </div>

      <button type="submit">
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