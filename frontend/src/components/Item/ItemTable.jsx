function ItemTable({ 
  items, 
  stockMovements,
  inventoryBalances,
  stockTransfers,
  onEdit, 
  onDelete, 
  onViewHistory, 
  canManageItems,
  emptyMessage = "No items found.",
}) {
  function getStatus(item) {
    if (item.quantity === 0) {
      return {
        text: "Out of stock",
        className: "status-out",
      };
    }

    if (item.quantity <= item.lowStockThreshold) {
      return {
        text: "Low stock",
        className: "status-low",
      };
    }

    return {
      text: "OK",
      className: "status-ok",
    }
  }

  function formatDateTime(dateTimeText) {
    if (!dateTimeText) {
      return "";
    }

    return new Date(dateTimeText).toLocaleString();
  }

  function hasInventoryHistory(itemId) {
    const hasStockMovements = stockMovements.some(
      (stockMovement) => stockMovement.itemId === itemId
    );

    const hasInventoryBalances = inventoryBalances.some(
      (inventoryBalance) => inventoryBalance.itemId === itemId
    );

    const hasStockTransfers = stockTransfers.some(
      (stockTransfer) => stockTransfer.itemId === itemId
    );

    return hasStockMovements || hasInventoryBalances || hasStockTransfers;
  }

  if (items.length === 0) {
    return <p>{emptyMessage}</p>
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>SKU</th>
          <th>Name</th>
          <th>Quantity</th>
          <th>Low Stock Threshold</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Updated At</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item) => {
          const status = getStatus(item);
          const itemHasInventoryHistory = hasInventoryHistory(item.id);

          return (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.sku}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.lowStockThreshold}</td>
              <td className={status.className}>{status.text}</td>
              <td>{formatDateTime(item.createdAt)}</td>
              <td>{formatDateTime(item.updatedAt)}</td>
              <td>
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  disabled={!canManageItems}
                >
                  Edit
                </button>
                
                <button
                  type="button" 
                  onClick={() => onDelete(item.id)} 
                  disabled={!canManageItems || itemHasInventoryHistory}
                >
                  Delete
                </button>

                <button
                  type="button" 
                  onClick={() => onViewHistory(item.id)}
                >
                  View History
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ItemTable;