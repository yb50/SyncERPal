function InventorySummary({ items }) {
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

  return (
    <div className="summary">
      <div>
        <strong>Total Items</strong>
        <p>{totalItems}</p>
      </div>

      <div>
        <strong>Total Quantity</strong>
        <p>{totalQuantity}</p>
      </div>

      <div>
        <strong>Low Stock</strong>
        <p>{lowStockCount}</p>
      </div>

      <div>
        <strong>Out of Stock</strong>
        <p>{outOfStockCount}</p>
      </div>
    </div>
  );
}

export default InventorySummary;