import ItemForm from "./ItemForm";
import ItemTable from "./ItemTable";

function ItemSection({
  items,
  name,
  sku,
  quantity,
  lowStockThreshold,
  editingId,
  loading,
  setName,
  setSku,
  setQuantity,
  setLowStockThreshold,
  saveItem,
  removeItem,
  startEditItem,
  clearItemForm,
  fetchStockMovementsForItem,
  setError,
  exportItems,
}) {
  function handleSubmit(event) {
    event.preventDefault();

    saveItem()
      .then(() => {
        setError("");
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function handleDelete(id) {
    removeItem(id)
      .then(() => {
        setError("");
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function handleEdit(item) {
    startEditItem(item);
  }

  function handleCancelEdit() {
    clearItemForm();
    setError("");
  }

  function handleViewHistory(itemId) {
    fetchStockMovementsForItem(itemId)
      .then(() => {
        setError("");
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <>
      <h2>Add Item</h2>

      <ItemForm
        name={name}
        sku={sku}
        quantity={quantity}
        lowStockThreshold={lowStockThreshold}
        editingId={editingId}
        onNameChange={setName}
        onSkuChange={setSku}
        onQuantityChange={setQuantity}
        onLowStockThreshold={setLowStockThreshold}
        onSubmit={handleSubmit}
        onCancelEdit={handleCancelEdit}
      />

      <h2>Items</h2>

      <button type="button" onClick={exportItems}>
        Export Items CSV
      </button>

      {loading && <p>Loading items...</p>}
      {!loading && items.length === 0 && <p>No items found</p>}
      
      {!loading && items.length > 0 && (
        <ItemTable
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewHistory={handleViewHistory}
        />
      )}
    </>
  );
}

export default ItemSection;