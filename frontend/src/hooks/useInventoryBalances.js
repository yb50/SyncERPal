import { useState } from "react";
import { getInventoryBalances, exportInventoryBalancesCsv } from "../api/inventoryBalanceApi";

function useInventoryBalances() {
  const [inventoryBalances, setInventoryBalances] = useState([]);

  function fetchInventoryBalances(token) {
    if (!token) {
      setInventoryBalances([]);
      return Promise.resolve();
    }

    return getInventoryBalances(token).then((data) => {
      setInventoryBalances(data);
    });
  }

  function exportInventoryBalances(token) {
    return exportInventoryBalancesCsv(token);
  }

  return {
    inventoryBalances,
    fetchInventoryBalances,
    exportInventoryBalances,
  };
}

export default useInventoryBalances;