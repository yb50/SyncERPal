import ItemForm from "./ItemForm";
import ItemTable from "./ItemTable";

function ItemSection({
  items,
  stockMovements,
  inventoryBalances,
  stockTransfers,
  name,
  sku,
  quantity,
  lowStockThreshold,
  editingId,
  loading,
  importFile,
  setName,
  setSku,
  setQuantity,
  setLowStockThreshold,
  saveItem,
  removeItem,
  startEditItem,
  clearItemForm,
  fetchStockMovementsForItem,
  fetchAuditLogs,
  setError,
  exportItems,
  setImportFile,
  importItems,
  currentUsername,
  canManageItems,
}) {
  function handleSubmit(event) {
    event.preventDefault();

    saveItem(currentUsername)
      .then(() => {
        setError("");
        fetchAuditLogs();
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function handleDelete(id) {
    removeItem(id, currentUsername)
      .then(() => {
        setError("");
        fetchAuditLogs();
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

  function handleImportItems(event) {
    event.preventDefault();

    importItems(currentUsername)
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

      {!canManageItems && (
        <p className="hint">
          Only ADMIN and MANAGER users can create, edit, delete, or import items.
        </p>
      )}

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
        canManageItems={canManageItems}
        onSubmit={handleSubmit}
        onCancelEdit={handleCancelEdit}
      />

      <h2>Items</h2>

      <button type="button" onClick={exportItems}>
        Export Items CSV
      </button>

      <form onSubmit={handleImportItems}>
        <input
          type="file"
          accept=".csv"
          onChange={(event) => setImportFile(event.target.files[0])}
        />

        <button type="submit" disabled={!canManageItems}>
          Import Items CSV
        </button>
      </form>

      {loading && <p>Loading items...</p>}
      {!loading && items.length === 0 && <p>No items found</p>}
      
      <p className="hint">
        Items with inventory history cannot be deleted.
      </p>

      {!loading && items.length > 0 && (
        <ItemTable
          items={items}
          stockMovements={stockMovements}
          inventoryBalances={inventoryBalances}
          stockTransfers={stockTransfers}
          canManageItems={canManageItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewHistory={handleViewHistory}
        />
      )}
    </>
  );
}

export default ItemSection;