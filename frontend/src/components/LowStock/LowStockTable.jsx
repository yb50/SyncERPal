function LowStockTable({ items }) {
  function getStatus(item) {
    if (item.quantity === 0) {
      return "Out of stock";
    }

    return "Low stock";
  }

  if (items.length === 0) {
    return <p>No low-stock or out-of-stock items found.</p>
  }

  return (
    <table>
      <thead>
        <tr>
          <th>SKU</th>
          <th>Name</th>
          <th>Quantity</th>
          <th>Low Stock Threshold</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.sku}</td>
            <td>{item.name}</td>
            <td>{item.quantity}</td>
            <td>{item.lowStockThreshold}</td>
            <td>{getStatus(item)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LowStockTable;