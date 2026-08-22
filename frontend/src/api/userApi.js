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

export function createUser(user, performedBy) {
  return fetch(USERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User" : performedBy,
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

export function updateUserRole(userId, role, performedBy) {
  return fetch(`${USERS_URL}/${userId}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-User": performedBy,
    },
    body: JSON.stringify({ role: role }),
  }).then((response) => {
     if (!response.ok) {
      return response.text().then((message) => {
        throw new Error(message || "Failed to update user role.");
      });
     }

     return response.json();
  })
}

export function deleteUser(userId, performedBy) {
  return fetch(`${USERS_URL}/${userId}`, {
    method: "DELETE",
    headers: {
      "X-User": performedBy,
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