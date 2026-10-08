import { useMemo, useState } from "react";
import ItemForm from "./ItemForm";
import ItemTable from "./ItemTable";
import PaginationControls from "../PaginationControls";
import SortControls from "../SortControls";

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
  handleApiError,
  exportItems,
  setImportFile,
  importItems,
  canManageItems,
  setSuccessMessage,
  authToken,
}) {
  const [itemSearchText, setItemSearchText] = useState("");
  const [selectedItemStatus, setSelectedItemStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const pageSize = 10;

  function handleSubmit(event) {
    event.preventDefault();

    setSuccessMessage("");

    saveItem(authToken)
      .then(() => {
        setError("");
        setSuccessMessage(
          editingId === null
            ? "Item created successfully."
            : "Item updated successfully."
        );
        fetchAuditLogs(authToken);
      })
      .catch((error) => {
        handleApiError(error);
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

    removeItem(id, authToken)
      .then(() => {
        setError("");
        setSuccessMessage("Item deleted successfully");
        fetchAuditLogs(authToken);
      })
      .catch((error) => {
        handleApiError(error);
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
    fetchStockMovementsForItem(itemId, authToken)
      .then(() => {
        setError("");
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  function handleImportItems(event) {
    event.preventDefault();

    importItems(authToken)
      .then(() => {
        setError("");
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  function handleExportItems() {
    exportItems(authToken)
      .then(() => {
        setError("");
      })
      .catch((error) => {
        handleApiError(error);
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

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortBy === "createdAt" || sortBy === "updatedAt") {
        const aTime = aValue ? new Date(aValue).getTime() : 0;
        const bTime = bValue ? new Date(bValue).getTime() : 0;

        return sortDirection === "asc" 
          ? aTime - bTime 
          : bTime - aTime;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      const aText = String(aValue ?? "").toLowerCase();
      const bText = String(bValue ?? "").toLowerCase();

      return sortDirection === "asc"
        ? aText.localeCompare(bText)
        : bText.localeCompare(aText);
    });
  }, [filteredItems, sortBy, sortDirection]);

  function clearItemFilters() {
    setItemSearchText("");
    setSelectedItemStatus("");
    setCurrentPage(1);
  }

  // + Pagination

  const totalPages = Math.ceil(sortedItems.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;

  const paginatedItems = sortedItems.slice(startIndex, startIndex + pageSize);

  function resetToFirstPage() {
    setCurrentPage(1);
  }

  function goToPreviousPage() {
    setCurrentPage((page) => Math.max(page - 1, 1));
  }

  function goToNextPage() {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  }

  // - Pagination

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

      <button type="button" onClick={handleExportItems}>
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
          onChange={(event) => {
            setItemSearchText(event.target.value);
            resetToFirstPage();
          }}
          placeholder="Search by SKU or name"
        />
      </div>

      <div>
        <label>Filter by status: </label>
        <select
          value={selectedItemStatus}
          onChange={(event) => {
            setSelectedItemStatus(event.target.value);
            resetToFirstPage();
          }}
        >
          <option value="">All statuses</option>
          <option value="OK">OK</option>
          <option value="LOW_STOCK">Low stock</option>
          <option value="OUT_OF_STOCK">Out of stock</option>
        </select>
      </div>

      <SortControls 
        sortBy={sortBy}
        sortDirection={sortDirection}
        sortOptions={[
          { value: "name", label: "Name" },
          { value: "sku", label: "SKU" },
          { value: "quantity", label: "Quantity" },
          { value: "lowStockThreshold", label: "Low-stock threshold" },
          { value: "createdAt", label: "Created at" },
          { value: "updatedAt", label: "Updated at" },
        ]}
        onSortByChange={(value) => {
          setSortBy(value);
          setCurrentPage(1);
        }}
        onSortDirectionChange={(value) => {
          setSortDirection(value);
          setCurrentPage(1);
        }}
      />

      <button type="button" onClick={clearItemFilters}>
        Clear Item Filters
      </button>

      <p className="table-summary">
        Showing {paginatedItems.length} of {filteredItems.length} items
      </p>

      {!loading && items.length > 0 && (
        <ItemTable
          items={paginatedItems}
          stockMovements={stockMovements}
          inventoryBalances={inventoryBalances}
          stockTransfers={stockTransfers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewHistory={handleViewHistory}
          canManageItems={canManageItems}
          emptyMessage="No items match the selected filters."
        />
      )}

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPreviousPage={goToPreviousPage}
        onNextPage={goToNextPage}
      />
    </>
  );
}

export default ItemSection;