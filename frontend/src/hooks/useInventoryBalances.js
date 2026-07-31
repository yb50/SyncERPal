import { useState } from "react";
import { getInventoryBalances, exportInventoryBalancesCsv } from "../api/inventoryBalanceApi";

function useInventoryBalances() {
  const [inventoryBalances, setInventoryBalances] = useState([]);

  function fetchInventoryBalances() {
    return getInventoryBalances().then((data) => {
      setInventoryBalances(data);
    });
  }

  function exportInventoryBalances() {
    exportInventoryBalancesCsv();
  }

  return {
    inventoryBalances,
    fetchInventoryBalances,
    exportInventoryBalances,
  };
}

export default useInventoryBalances;