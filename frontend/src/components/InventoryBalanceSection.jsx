import InventoryBalanceTable from "./InventoryBalanceTable";

function InventoryBalanceSection({ inventoryBalances, items, locations }) {
  return (
    <>
      <h2>Inventory Balances</h2>

      <InventoryBalanceTable 
        inventoryBalances={inventoryBalances}
        items={items}
        locations={locations}
      />
    </>
  );
}

export default InventoryBalanceSection;