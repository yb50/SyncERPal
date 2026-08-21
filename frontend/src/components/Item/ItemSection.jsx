import { useState } from "react";
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
  setSuccessMessage,
}) {
  const [itemSearchText, setItemSearchText] = useState("");
  const [selectedItemStatus, setSelectedItemStatus] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    setSuccessMessage("");

    saveItem(currentUsername)
      .then(() => {
        setError("");
        setSuccessMessage(
          editingId === null
            ? "Item created successfully."
            : "Item updated successfully."
        );
        fetchAuditLogs();
      })
      .catch((error) => {
        setSuccessMessage("");
        setError(error.message);
      });
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmed) {
      return;
    }

    setSuccessMessage("");

    removeItem(id, currentUsername)
      .then(() => {
        setError("");
        setSuccessMessage("Item deleted successfully");
        fetchAuditLogs();
      })
      .catch((error) => {
        setSuccessMessage("");
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

  function getItemStatus(item) {
    if (item.quantity === 0) {
      return "OUT_OF_STOCK";
    }

    if (item.quantity <= item.lowStockThreshold) {
      return "LOW_STOCK";
    }

    return "OK";
  }

  const filteredItems = items.filter((item) => {
    const searchText = itemSearchText.toLowerCase();

    const matchesSearch = 
      itemSearchText === "" ||
      item.sku.toLowerCase().includes(searchText) ||
      item.name.toLowerCase().includes(searchText);

    const matchesStatus = 
      selectedItemStatus == "" ||
      getItemStatus(item) === selectedItemStatus;

    return matchesSearch && matchesStatus;
  });

  function clearItemFilters() {
    setItemSearchText("");
    setSelectedItemStatus("");
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

      <div>
        <label>Search items: </label>
        <input 
          type="text"
          value={itemSearchText}
          onChange={(event) => setItemSearchText(event.target.value)}
          placeholder="Search by SKU or name"
        />
      </div>

      <div>
        <label>Filter by status: </label>
        <select
          value={selectedItemStatus}
          onChange={(event) => setSelectedItemStatus(event.target.value)}
        >
          <option value="">All statuses</option>
          <option value="OK">OK</option>
          <option value="LOW_STOCK">Low stock</option>
          <option value="OUT_OF_STOCK">Out of stock</option>
        </select>
      </div>

      <button type="button" onClick={clearItemFilters}>
        Clear Item Filters
      </button>

      {!loading && items.length > 0 && (
        <ItemTable
          items={filteredItems}
          stockMovements={stockMovements}
          inventoryBalances={inventoryBalances}
          stockTransfers={stockTransfers}
          canManageItems={canManageItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewHistory={handleViewHistory}
          emptyMessage="No items match the selected filters."
        />
      )}
    </>
  );
}

export default ItemSection;