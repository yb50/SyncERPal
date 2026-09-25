import { handleApiResponse } from "./apiError";
import { BASE_URL } from "./config";

const USERS_URL = `${BASE_URL}/users`;

export function getUsers(token) {
  return fetch(USERS_URL, {
    headers: {
      Authorization: `Bearer ${token},`
    },
  })
    .then((response) => handleApiResponse(response, "Failed to fetch users."))
    .then((response) => response.json());
}

export function setupFirstUser(user) {
  return fetch(`${USERS_URL}/setup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) =>
      handleApiResponse(response, "Failed to create first user.")
    )
    .then((response) => response.json());
}

export function createUser(user, token) {
  return fetch(USERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  })
    .then((response) => handleApiResponse(response, "Failed to create user."))
    .then((response) => response.json());
}

export function updateUserRole(userId, role, token) {
  return fetch(`${USERS_URL}/${userId}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  })
    .then((response) =>
      handleApiResponse(response, "Failed to update user role.")
    )
    .then((response) => response.json());
}

export function deleteUser(userId, token) {
  return fetch(`${USERS_URL}/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => handleApiResponse(response, "Failed to delete user."))
    .then((response) => response.json());
}