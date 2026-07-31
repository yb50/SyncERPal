import InventoryBalanceTable from "./InventoryBalanceTable";

function InventoryBalanceSection({ inventoryBalances, items, locations, exportInventoryBalances }) {
  return (
    <>
      <h2>Inventory Balances</h2>

      <button type="button" onClick={exportInventoryBalances}>
        Export Inventory Balances CSV
      </button>

      <InventoryBalanceTable 
        inventoryBalances={inventoryBalances}
        items={items}
        locations={locations}
      />
    </>
  );
}

export default InventoryBalanceSection;