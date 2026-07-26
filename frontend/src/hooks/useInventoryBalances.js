import { useState } from "react";
import { getInventoryBalances } from "../api/inventoryBalanceApi";

function useInventoryBalances() {
  const [inventoryBalances, setInventoryBalances] = useState([]);

  function fetchInventoryBalances() {
    return getInventoryBalances().then((data) => {
      setInventoryBalances(data);
    });
  }

  return {
    inventoryBalances,
    fetchInventoryBalances,
  };
}

export default useInventoryBalances;