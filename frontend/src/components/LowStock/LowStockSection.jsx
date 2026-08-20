import LowStockTable from "./LowStockTable";

function LowStockSection({ items, exportLowStockItems }) {
  const lowStockItems = items.filter((item) => {
    const isOutOfStock = item.quantity === 0;
    const isLowStock = 
      item.quantity > 0 && item.quantity <= item.lowStockThreshold;

    return isOutOfStock || isLowStock;
  });

  return (
    <>
      <h2>Low Stock Report</h2>

      <button type="button" onClick={exportLowStockItems}>
        Export Low Stock CSV
      </button>

      <LowStockTable items={lowStockItems} />
    </>
  );
}

export default LowStockSection;