import { BASE_URL } from "./config";
const STOCK_TRANSFERS_URL = `${BASE_URL}/stock-transfers`;

export function getStockTransfers() {
  return fetch(STOCK_TRANSFERS_URL).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load stock transfers.");
    }

    return response.json();
  });
}

export function createStockTransfer(stockTransfer, performedBy) {
  return fetch(STOCK_TRANSFERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User": performedBy,
    },
    body: JSON.stringify(stockTransfer),
  }).then((response) => {
    if (!response.ok) {
      return response.text().then((message) => {
        throw new Error(message || "Failed to transfer stock.");
      });
    }

    return response.json();
  });
}

export function exportStockTransfersCsv() {
  window.location.href = `${STOCK_TRANSFERS_URL}/export`;
}