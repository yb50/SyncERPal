import { handleApiResponse } from "./apiError";
import { BASE_URL } from "./config";

const STOCK_TRANSFERS_URL = `${BASE_URL}/stock-transfers`;

export function getStockTransfers(token) {
  return fetch(STOCK_TRANSFERS_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) =>
      handleApiResponse(response, "Failed to fetch stock transfers.")
    )
    .then((response) => response.json());
}

export function createStockTransfer(stockTransfer, token) {
  return fetch(STOCK_TRANSFERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(stockTransfer),
  })
    .then((response) =>
      handleApiResponse(response, "Failed to create stock transfer.")
    )
    .then((response) => response.json());
}

export function exportStockTransfersCsv(token) {
  return fetch(`${STOCK_TRANSFERS_URL}/export`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) =>
      handleApiResponse(response, "Failed to export stock transfers.")
    )
    .then((response) => response.blob())
    .then((blob) => {
      downloadBlob(blob, "stock-transfers.csv");
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