function ItemTable({items, onEdit, onDelete, onViewHistory}) {
  function formatDateTime(dateTimeText) {
    if (!dateTimeText) {
      return "";
    }

    const date = new Date(dateTimeText);

    return date.toLocaleString();
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
          let stockStatus = "OK";
          let statusClassName = "status-ok";

          if (item.quantity === 0) {
            stockStatus = "Out of stock";
            statusClassName = "status-out";
          } else if (item.quantity <= item.lowStockThreshold) {
            stockStatus = "Low stock";
            statusClassName = "status-low";
          }

          return (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.sku}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.lowStockThreshold}</td>
              <td className={statusClassName}>{stockStatus}</td>
              <td>{formatDateTime(item.createdAt)}</td>
              <td>{formatDateTime(item.updatedAt)}</td>
              <td>
                <button onClick={() => onViewHistory(item.id)}>
                  View History
                </button>
                <button onClick={() => onEdit(item)}>Edit</button>
                <button onClick={() => onDelete(item.id)}>Delete</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ItemTable;