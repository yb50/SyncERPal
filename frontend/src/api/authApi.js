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

export function getCurrentUser(token) {
  return fetch(`${AUTH_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    if (!response.ok) {
      return response.text().then((message) => {
        throw new Error(message || "Failed to get current user.");
      });
    }

    return response.json();
  });
}

export function logoutUser(token) {
  return fetch(`${AUTH_URL}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    if (!response.ok) {
      return response.text().then((message) => {
        throw new Error(message || "Failed to logout.");
      });
    }
  });
}