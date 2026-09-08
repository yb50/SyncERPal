import { useState } from "react";
import InventoryBalanceTable from "./InventoryBalanceTable";
import PaginationControls from "../PaginationControls";

function InventoryBalanceSection({
  inventoryBalances,
  items,
  locations,
  exportInventoryBalances,
}) {
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const filteredInventoryBalances = inventoryBalances.filter((inventoryBalance) => {
    const matchesItem =
      selectedItemId === "" ||
      String(inventoryBalance.itemId) === selectedItemId;

    const matchesLocation =
      selectedLocationId === "" ||
      String(inventoryBalance.locationId) === selectedLocationId;

    return matchesItem && matchesLocation;
  });

  // + Pagination

  const totalPages = Math.ceil(filteredInventoryBalances.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;

  const paginatedInventoryBalances = filteredInventoryBalances.slice(
    startIndex,
    startIndex + pageSize
  );

  function resetToFirstPage() {
    setCurrentPage(1);
  }
  
  function goToPreviousPage() {
    setCurrentPage((page) => Math.max(page - 1, 1));
  }
  
  function goToNextPage() {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  }

  // - Pagination
  
  function clearFilters() {
    setSelectedItemId("");
    setSelectedLocationId("");
    setCurrentPage(1);
  }

  return (
    <>
      <h2>Inventory Balances</h2>

      <button type="button" onClick={exportInventoryBalances}>
        Export Inventory Balances CSV
      </button>

      <div>
        <label>Filter by item: </label>
        <select
          value={selectedItemId}
          onChange={(event) => {
            setSelectedItemId(event.target.value);
            resetToFirstPage();
          }}
        >
          <option value="">All items</option>

          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} ({item.sku})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Filter by location: </label>
        <select
          value={selectedLocationId}
          onChange={(event) => {
            setSelectedLocationId(event.target.value);
            resetToFirstPage();
          }}
        >
          <option value="">All locations</option>

          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.code} - {location.name}
            </option>
          ))}
        </select>
      </div>

      <button type="button" onClick={clearFilters}>
        Clear Balance Filters
      </button>

      <p className="table-summary">
        Showing {paginatedInventoryBalances.length} of{" "}
        {filteredInventoryBalances.length} inventory balances
      </p>

      <InventoryBalanceTable
        inventoryBalances={paginatedInventoryBalances}
        items={items}
        locations={locations}
        emptyMessage="No inventory balances match the selected filters."
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

export default InventoryBalanceSection;