import { BASE_URL } from "./config";
const INVENTORY_BALANCES_URL = `${BASE_URL}/inventory-balances`;

export function getInventoryBalances() {
  return fetch(INVENTORY_BALANCES_URL).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load inventory balances.");
    }

    return response.json();
  });
}

export function exportInventoryBalancesCsv() {
  window.location.href = `${INVENTORY_BALANCES_URL}/export`;
}