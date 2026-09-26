import { handleApiResponse } from "./apiError";
import { BASE_URL } from "./config";

const STOCK_MOVEMENTS_URL = `${BASE_URL}/stock-movements`;

export function getStockMovements(token, itemId) {
  const url = itemId
    ? `${STOCK_MOVEMENTS_URL}?itemId=${itemId}`
    : STOCK_MOVEMENTS_URL;

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) =>
      handleApiResponse(response, "Failed to fetch stock movements.")
    )
    .then((response) => response.json());
}

export function getStockMovementsForItem(itemId, token) {
  return fetch(`${BASE_URL}/items/${itemId}/stock-movements`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) =>
      handleApiResponse(response, "Failed to fetch item stock movements.")
    )
    .then((response) => response.json());
}

export function createStockMovement(stockMovement, token) {
  return fetch(STOCK_MOVEMENTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(stockMovement),
  })
    .then((response) =>
      handleApiResponse(response, "Failed to create stock movement.")
    )
    .then((response) => response.json());
}

export function exportStockMovementsCsv(token) {
  return fetch(`${STOCK_MOVEMENTS_URL}/export`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) =>
      handleApiResponse(response, "Failed to export stock movements.")
    )
    .then((response) => response.blob())
    .then((blob) => {
      downloadBlob(blob, "stock-movements.csv");
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