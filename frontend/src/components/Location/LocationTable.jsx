function LocationTable({
  locations,
  stockMovements,
  inventoryBalances,
  stockTransfers,
  onEdit,
  onDelete,
  canManageLocations,
}) {
  function hasInventoryHistory(locationId) {
    const hasInventoryBalances = inventoryBalances.some(
      (inventoryBalance) => inventoryBalance.locationId === locationId
    );

    const hasStockMovements = stockMovements.some(
      (stockMovement) => stockMovement.locationId === locationId
    );

    const hasStockTransfers = stockTransfers.some(
      (stockTransfer) =>
        stockTransfer.fromLocationId === locationId ||
        stockTransfer.toLocationId === locationId
    );

    return hasInventoryBalances || hasStockMovements || hasStockTransfers;
  }

  if (locations.length === 0) {
    return <p>No locations found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Code</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {locations.map((location) => {
          const locationHasInventoryHistory = hasInventoryHistory(location.id);

          return (
            <tr key={location.id}>
              <td>{location.id}</td>
              <td>{location.code}</td>
              <td>{location.name}</td>
              <td>
                <button
                  type="button"
                  onClick={() => onEdit(location)}
                  disabled={!canManageLocations}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(location.id)}
                  disabled={!canManageLocations || locationHasInventoryHistory}
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default LocationTable;