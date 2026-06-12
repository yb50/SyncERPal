function StockMovementTable({ stockMovements, items }) {
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
          <th>Item</th>
          <th>Type</th>
          <th>Quantity</th>
          <th>Note</th>
          <th>Created At</th>
        </tr>
      </thead>

      <tbody>
        {stockMovements.map((movement) => {
          const item = items.find((item) => item.id === movement.itemId);

          return (
            <tr key={movement.id}>
              <td>{movement.id}</td>
              <td>
                {item ? `${item.name} (${item.sku})` : `Item ${movement.itemId}`}
              </td>
              <td>{movement.type}</td>
              <td>{movement.quantity}</td>
              <td>{movement.note}</td>
              <td>{formatDateTime(movement.createdAt)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  )
}

export default StockMovementTable;