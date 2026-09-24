import { BASE_URL } from "./config";
const USERS_URL = `${BASE_URL}/users`;

export function getUsers() {
  return fetch(USERS_URL).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load users.");
    }

    return response.json();
  });
}

export function setupFirstUser(user) {
  return fetch(`${USERS_URL}/setup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  }).then((response) => {
    if (!response.ok) {
      return response.text().then((message) => {
        throw new Error(message || "Failed to create first user.");
      });
    }

    return response.json();
  });
}

export function createUser(user, token) {
  return fetch(USERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(user),
  }).then((response) => {
    if (!response.ok) {
      return response.text().then((message) => {
        throw new Error(message || "Failed to create user.");
      });
    }

    return response.json();
  });
}

export function updateUserRole(userId, role, token) {
  return fetch(`${USERS_URL}/${userId}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  }).then((response) => {
    if (!response.ok) {
      return response.text().then((message) => {
        throw new Error(message || "Failed to update user role.");
      });
    }

    return response.json();
  });
}

export function deleteUser(userId, token) {
  return fetch(`${USERS_URL}/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    if (!response.ok) {
      return response.text().then((message) => {
        throw new Error(message || "Failed to delete user.");
      });
    }

    return response.json();
  });
}