function StockTransferTable({ stockTransfers, items, locations }) {
  function getItemText(itemId) {
    const item = items.find((item) => item.id === itemId);

    if (!item) {
      return `Item ${itemId}`;
    }

    return `${item.name} (${item.sku})`;
  }

  function getLocationText(locationId) {
    const location = locations.find((location) => location.id === locationId);

    if (!location) {
      return `Location ${locationId}`;
    }

    return `${location.code} - ${location.name}`;
  }

  function formatDateTime(dateTimeText) {
    if (!dateTimeText) {
      return "";
    }

    return new Date(dateTimeText).toLocaleString();
  }

  if (stockTransfers.length === 0) {
    return <p>No stock transfers found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Item</th>
          <th>From</th>
          <th>To</th>
          <th>Quantity</th>
          <th>Note</th>
          <th>Performed By</th>
          <th>Created At</th>
        </tr>
      </thead>

      <tbody>
        {stockTransfers.map((stockTransfer) => (
          <tr key={stockTransfer.id}>
            <td>{stockTransfer.id}</td>
            <td>{getItemText(stockTransfer.itemId)}</td>
            <td>{getLocationText(stockTransfer.fromLocationId)}</td>
            <td>{getLocationText(stockTransfer.toLocationId)}</td>
            <td>{stockTransfer.quantity}</td>
            <td>{stockTransfer.note}</td>
            <td>{stockTransfer.performedBy}</td>
            <td>{formatDateTime(stockTransfer.createdAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default StockTransferTable;