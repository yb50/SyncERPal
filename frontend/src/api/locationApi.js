import { BASE_URL } from "./config";
const LOCATIONS_URL = `${BASE_URL}/locations`;

export function getLocations() {
  return fetch(LOCATIONS_URL).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load locations.");
    }

    return response.json();
  });
}

export function createLocation(location, token) {
  return fetch(LOCATIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(location),
  }).then((response) => {
    if (!response.ok) {
      return response.text().then((message) => {
        throw new Error(message || "Failed to create location.");
      });
    }

    return response.json();
  });
}

export function updateLocation(locationId, location, token) {
  return fetch(`${LOCATIONS_URL}/${locationId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(location),
  }).then((response) => {
    if (!response.ok) {
      return response.text().then((message) => {
        throw new Error(message || "Failed to update location.");
      });
    }

    return response.json();
  });
}

export function deleteLocation(locationId, token) {
  return fetch(`${LOCATIONS_URL}/${locationId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    if (!response.ok) {
      return response.text().then((message) => {
        throw new Error(message || "Failed to delete location.");
      });
    }

    return response.json();
  });
}