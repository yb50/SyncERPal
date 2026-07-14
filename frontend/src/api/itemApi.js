const BASE_URL = "http://localhost:8080";
const ITEMS_URL = `${BASE_URL}/items`;

export function getItems() {
  return fetch(ITEMS_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load items.")
      }

      return response.json();
    });
}

export function createItem(item, performedBy) {
  return fetch(ITEMS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User": performedBy,
    },
    body: JSON.stringify(item),
  }).then((response) => {
    if (!response.ok) {
      return response.text().then((message) => {
        throw new Error(message || "Failed to create item.");
      });
    }

    return response.json();
  });
}

export function updateItem(id, item, performedBy) {
  return fetch(`${ITEMS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-User": performedBy,
    },
    body: JSON.stringify(item),
  }).then((response) => {
    if (!response.ok) {
      return response.text().then((message) => {
        throw new Error(message || "Failed to update item.");
      });
    }

    return response.json();
  });
}

export function deleteItem(id, performedBy) {
  return fetch(`${ITEMS_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "X-User": performedBy,
    },
  }).then((response) => {
    if (!response.ok) {
      return response.text().then((message) => {
        throw new Error(message || "Failed to delete item.");
      });
    }

    return response.json();
  });
}

export function exportItemsCsv() {
  window.location.href = `${ITEMS_URL}/export`;
}

export function importItemsCsv(file, performedBy) {
  const formData = new FormData();
  formData.append("file", file);

  return fetch(`${ITEMS_URL}/import`, {
    method: "POST",
    headers: {
      "X-User": performedBy,
    },
    body: formData,
  }).then((response) => {
    if (!response.ok) {
      return response.text().then((message) => {
        throw new Error(message || "Failed to import items.");
      });
    }

    return response.text();
  });
}