const BASE_URL = "http://localhost:8080";
const INVENTORY_BALANCES_URL = `${BASE_URL}/inventory-balances`;

export function getInventoryBalances() {
  return fetch(INVENTORY_BALANCES_URL).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load inventory balances.");
    }

    return response.json();
  });
}