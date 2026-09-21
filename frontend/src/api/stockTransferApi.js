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

export function createStockTransfer(stockTransfer, token) {
  return fetch(STOCK_TRANSFERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(stockTransfer),
  }).then((response) => {
    if (!response.ok) {
      return response.text().then((message) => {
        throw new Error(message || "Failed to create stock transfer.");
      });
    }

    return response.json();
  });
}

export function exportStockTransfersCsv() {
  window.location.href = `${STOCK_TRANSFERS_URL}/export`;
}