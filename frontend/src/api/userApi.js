const BASE_URL = "http://localhost:8080";
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