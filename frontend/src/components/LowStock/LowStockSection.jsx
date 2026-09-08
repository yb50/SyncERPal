import { useState } from "react";
import LowStockTable from "./LowStockTable";
import PaginationControls from "./PaginationControls";

function LowStockSection({ items, exportLowStockItems }) {
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const lowStockItems = items.filter((item) => {
    const isOutOfStock = item.quantity === 0;
    const isLowStock =
      item.quantity > 0 && item.quantity <= item.lowStockThreshold;

    return isOutOfStock || isLowStock;
  });

  // + Pagination

  const totalPages = Math.ceil(lowStockItems.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;

  const paginatedLowStockItems = lowStockItems.slice(
    startIndex,
    startIndex + pageSize
  );

  function goToPreviousPage() {
    setCurrentPage((page) => Math.max(page - 1, 1));
  }

  function goToNextPage() {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  }

  // - Pagination

  return (
    <>
      <h2>Low Stock Report</h2>

      <button type="button" onClick={exportLowStockItems}>
        Export Low Stock CSV
      </button>

      <p className="table-summary">
        Showing {paginatedLowStockItems.length} of {lowStockItems.length} low-stock items
      </p>

      <LowStockTable
        items={paginatedLowStockItems}
        emptyMessage="No low-stock or out-of-stock items found."
      />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPreviousPage={goToPreviousPage}
        onNextPage={goToNextPage}
      />
    </>
  );
}

export default LowStockSection;