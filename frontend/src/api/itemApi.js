import { handleApiResponse } from "./apiError";
import { BASE_URL } from "./config";

const ITEMS_URL = `${BASE_URL}/items`;

export function getItems() {
  return fetch(ITEMS_URL)
    .then((response) => handleApiResponse(response, "Failed to fetch items."))
    .then((response) => response.json());
}

export function createItem(item, token) {
  return fetch(ITEMS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(item),
  })
    .then((response) => handleApiResponse(response, "Failed to create item."))
    .then((response) => response.json());
}

export function updateItem(id, item, token) {
  return fetch(`${ITEMS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(item),
  })
    .then((response) => handleApiResponse(response, "Failed to update item."))
    .then((response) => response.json());
}

export function deleteItem(id, token) {
  return fetch(`${ITEMS_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => handleApiResponse(response, "Failed to delete item."))
    .then((response) => response.json());
}

export function exportItemsCsv() {
  return fetch(`${ITEMS_URL}/export`)
    .then((response) => handleApiResponse(response, "Failed to export items."))
    .then((response) => response.blob())
    .then((blob) => {
      downloadBlob(blob, "items.csv");
    });
}

export function importItemsCsv(file, token) {
  const formData = new FormData();
  formData.append("file", file);

  return fetch(`${ITEMS_URL}/import`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }).then((response) =>
    handleApiResponse(response, "Failed to import items.")
  );
}

export function exportLowStockItemsCsv() {
  return fetch(`${ITEMS_URL}/low-stock/export`)
    .then((response) =>
      handleApiResponse(response, "Failed to export low stock items.")
    )
    .then((response) => response.blob())
    .then((blob) => {
      downloadBlob(blob, "low-stock-items.csv");
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