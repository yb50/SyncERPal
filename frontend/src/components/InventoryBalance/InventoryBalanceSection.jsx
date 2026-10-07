import { useMemo, useState } from "react";
import InventoryBalanceTable from "./InventoryBalanceTable";
import PaginationControls from "../PaginationControls";

function InventoryBalanceSection({
  inventoryBalances,
  items,
  locations,
  exportInventoryBalances,
  authToken
}) {
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("item");
  const [sortDirection, setSortDirection] = useState("asc");

  const pageSize = 10;

  // + Filtering

  const filteredInventoryBalances = inventoryBalances.filter((inventoryBalance) => {
    const matchesItem =
      selectedItemId === "" ||
      String(inventoryBalance.itemId) === selectedItemId;

    const matchesLocation =
      selectedLocationId === "" ||
      String(inventoryBalance.locationId) === selectedLocationId;

    return matchesItem && matchesLocation;
  });

  // - Filtering

  // + Sorting

  function getItemSortText(inventoryBalance) {
    const item = items.find(
      (item) => item.id === Number(inventoryBalance.itemId)
    );

    if (!item) {
      return "";
    }

    return `${item.name} ${item.sku}`.toLowerCase();
  }

  function getLocationSortText(inventoryBalance) {
    const location = locations.find(
      (location) => location.id === Number(inventoryBalance.locationId)
    );

    if (!location) {
      return "";
    }

    return `${location.code} ${location.name}`.toLowerCase();
  }

  function getInventoryBalanceSortValue(inventoryBalance) {
    switch (sortBy) {
      case "item":
        return getItemSortText(inventoryBalance);
      case "location":
        return getLocationSortText(inventoryBalance);
      case "quantity":
        return inventoryBalance.quantity ?? 0;
      default:
        return getItemSortText(inventoryBalance);
    }
  }

  const sortedInventoryBalances = useMemo(() => {
    return [...filteredInventoryBalances].sort((a, b) => {
      const aValue = getInventoryBalanceSortValue(a);
      const bValue = getInventoryBalanceSortValue(b);

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      const aText = String(aValue).toLowerCase();
      const bText = String(bValue).toLowerCase();

      return sortDirection === "asc"
        ? aText.localeCompare(bText)
        : bText.localeCompare(aText);
    });
  }, [filteredInventoryBalances, sortBy, sortDirection, items, locations]);

  // - Sorting

  // + Pagination

  const totalPages = Math.ceil(sortedInventoryBalances.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;

  const paginatedInventoryBalances = sortedInventoryBalances.slice(
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

      <button type="button" onClick={() => exportInventoryBalances(authToken)}>
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

      <div className="filter-row">
        <label>
          Sort by:
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="item">Item</option>
            <option value="location">Location</option>
            <option value="quantity">Quantity</option>
          </select>
        </label>

        <label>
          Direction:
          <select
            value={sortDirection}
            onChange={(e) => {
              setSortDirection(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
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