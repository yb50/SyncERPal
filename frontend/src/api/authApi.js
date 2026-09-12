import { BASE_URL } from "./config";

const AUTH_URL = `${BASE_URL}/auth`;

export function loginUser(credentials) {
  return fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((response) => {
    if (!response.ok) {
      return response.text().then((message) => {
        throw new Error(message || "Failed to login.");
      });
    }

    return response.json();
  });
}