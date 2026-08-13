import { useState } from "react";
import InventoryBalanceTable from "./InventoryBalanceTable";

function InventoryBalanceSection({ 
  inventoryBalances, 
  items, 
  locations, 
  exportInventoryBalances 
}) {
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");

  const filteredInventoryBalances = inventoryBalances.filter((inventoryBalance) => {
    const matchesItem = 
      selectedItemId === "" || 
      String(inventoryBalance.itemId) === selectedItemId;

    const matchesLocation =
      selectedLocationId === "" ||
      String(inventoryBalance.locationId) === selectedLocationId;

    return matchesItem && matchesLocation;
  });

  function clearFilters() {
    setSelectedItemId("");
    selectedLocationId("");
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
          onChange={(event) => setSelectedItemId(event.target.value)}
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
          onChange={(event) => setSelectedLocationId(event.target.value)}
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

      <InventoryBalanceTable 
        inventoryBalances={filteredInventoryBalances}
        items={items}
        locations={locations}
        emptyMessage="No inventory balances match the selected filters."
      />
    </>
  );
}

export default InventoryBalanceSection;