function InventoryBalanceTable({ 
  inventoryBalances, 
  items, 
  locations,
  emptyMessage = "No inventory balances found.", 
}) {
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
      return `Location ${locationId};`
    }

    return `${location.code} - ${location.name}`;
  }

  if (inventoryBalances.length === 0) {
    return <p>{emptyMessage}</p>
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Location</th>
          <th>Quantity</th>
        </tr>
      </thead>

      <tbody>
        {inventoryBalances.map((inventoryBalance) => (
          <tr key={inventoryBalance.id}>
            <td>{getItemText(inventoryBalance.itemId)}</td>
            <td>{getLocationText(inventoryBalance.locationId)}</td>
            <td>{inventoryBalance.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default InventoryBalanceTable;