function StockMovementTable({
  stockMovements,
  items,
  locations,
  emptyMessage = "No stock movements found.",
}) {
  function formatDateTime(dateTimeText) {
    if (!dateTimeText) {
      return "";
    }

    const date = new Date(dateTimeText);

    return date.toLocaleString();
  }

  function getLocationText(locationId) {
    const location = locations.find((location) => location.id === locationId);

    if (!location) {
      return locationId ? `Location ${locationId}` : "No location";
    }

    return `${location.code} - ${location.name}`;
  }

  if (stockMovements.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Item</th>
          <th>Location</th>
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
                {item
                  ? `${item.name} (${item.sku})`
                  : `Item ${movement.itemId}`}
              </td>
              <td>{getLocationText(movement.locationId)}</td>
              <td>{movement.type}</td>
              <td>{movement.quantity}</td>
              <td>{movement.note}</td>
              <td>{formatDateTime(movement.createdAt)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default StockMovementTable;