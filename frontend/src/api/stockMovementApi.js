const BASE_URL = "http://localhost:8080";
const STOCK_MOVEMENTS_URL = `${BASE_URL}/stock-movements`;

export function getStockMovements(itemId) {
  const url = itemId
    ? `${STOCK_MOVEMENTS_URL}?itemId=${itemId}`
    : STOCK_MOVEMENTS_URL;

  return fetch(url).then((response) => {
    if(!response.ok) {
      throw new Error("Failed to load stock movements.");
    }

    return response.json();
  });
}

export function createStockMovement(stockMovement) {
  return fetch(STOCK_MOVEMENTS_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(stockMovement),
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((message) => {
          throw new Error(message);
        });
      }

      return response.json();
    })
}