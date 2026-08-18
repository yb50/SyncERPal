function InventorySummary({
  items = [],
  locations = [],
  inventoryBalances = [],
  stockMovements = [],
  stockTransfers = [],
  users = [],
  auditLogs = [],
}) {
  const totalItems = items.length;

  const totalQuantity = items.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  const lowStockCount = items.filter((item) => {
    return item.quantity > 0 && item.quantity <= item.lowStockThreshold;
  }).length;

  const outOfStockCount = items.filter((item) => {
    return item.quantity === 0;
  }).length;

  const recentAuditLog = auditLogs.length > 0 ? auditLogs[0] : null;

  return (
    <>
      <h2>Dashboard</h2>

      <div className="summary">
        <div className="summary-card">
          <h3>Total Items</h3>
          <p>{totalItems}</p>
        </div>

        <div className="summary-card">
          <h3>Total Stock</h3>
          <p>{totalQuantity}</p>
        </div>

        <div className="summary-card">
          <h3>Low Stock</h3>
          <p>{lowStockCount}</p>
        </div>

        <div className="summary-card">
          <h3>Out of Stock</h3>
          <p>{outOfStockCount}</p>
        </div>

        <div className="summary-card">
          <h3>Locations</h3>
          <p>{locations.length}</p>
        </div>

        <div className="summary-card">
          <h3>Balance Rows</h3>
          <p>{inventoryBalances.length}</p>
        </div>

        <div className="summary-card">
          <h3>Stock Movements</h3>
          <p>{stockMovements.length}</p>
        </div>

        <div className="summary-card">
          <h3>Stock Transfers</h3>
          <p>{stockTransfers.length}</p>
        </div>

        <div className="summary-card">
          <h3>Users</h3>
          <p>{users.length}</p>
        </div>
      </div>

      <div className="summary-recent">
        <h3>Latest Activity</h3>

        {recentAuditLog ? (
          <p>
            {recentAuditLog.action} by {recentAuditLog.performedBy}:{" "}
            {recentAuditLog.message}
          </p>
        ) : (
          <p>No activity yet.</p>
        )}
      </div>
    </>
  );
}

export default InventorySummary;