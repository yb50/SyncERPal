import { BASE_URL } from "./config";
import { handleApiResponse } from "./apiError";

const AUTH_URL = `${BASE_URL}/auth`;

export function getSetupStatus() {
  return fetch(`${AUTH_URL}/setup-required`)
    .then((response) => handleApiResponse(response, "Failed to check setup status."))
    .then((response) => response.json());
}

export function loginUser(credentials) {
  return fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })
    .then((response) => handleApiResponse(response, "Failed to login."))
    .then((response) => response.json());
}

export function getCurrentUser(token) {
  return fetch(`${AUTH_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) =>
      handleApiResponse(response, "Failed to get current user."))
    .then((response) => response.json());
}

export function logoutUser(token) {
  return fetch(`${AUTH_URL}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => handleApiResponse(response, "Failed to logout."));
}