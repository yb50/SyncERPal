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

export function createItem(item) {
  return fetch(ITEMS_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(item),
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((message) => {
          throw new Error(message);
        });
      }

      return response.json();
    });
}

export function updateItem(id, item) {
  return fetch(`${ITEMS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(item),
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((message) => {
          throw new Error(message);
        });
      }

      return response.json();
    });
}

export function deleteItem(id) {
  return fetch(`${ITEMS_URL}/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete item.");
      }

      return response.json();
    });
}