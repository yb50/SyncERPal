import { handleApiResponse } from "./apiError";
import { BASE_URL } from "./config";

const INVENTORY_BALANCES_URL = `${BASE_URL}/inventory-balances`;

export function getInventoryBalances() {
  return fetch(INVENTORY_BALANCES_URL)
    .then((response) =>
      handleApiResponse(response, "Failed to fetch inventory balances.")
    )
    .then((response) => response.json());
}

export function exportInventoryBalancesCsv() {
  return fetch(`${INVENTORY_BALANCES_URL}/export`)
    .then((response) =>
      handleApiResponse(response, "Failed to export inventory balances.")
    )
    .then((response) => response.blob())
    .then((blob) => {
      downloadBlob(blob, "inventory-balances.csv");
    });
}

function downloadBlob(blob, fileName) {
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  window.URL.revokeObjectURL(url);
}