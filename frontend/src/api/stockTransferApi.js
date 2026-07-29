const BASE_URL = "http://localhost:8080";
const STOCK_TRANSFERS_URL = `${BASE_URL}/stock-transfers`;

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

    return response.text();
  });
}