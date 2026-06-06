function ItemTable({items, onEdit, onDelete}) {
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
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item) => {
          let stockStatus = "OK";

          if (item.quantity === 0) {
            stockStatus = "Out of stock";
          } else if (item.quantity <= item.lowStockThreshold) {
            stockStatus = "Low stock";
          }

          return (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.sku}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.lowStockThreshold}</td>
              <td>{stockStatus}</td>
              <td>
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