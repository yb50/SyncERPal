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

export function createLocation(location, performedBy) {
  return fetch(LOCATIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User": performedBy,
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

export function updateLocation(locationId, location, performedBy) {
  return fetch(`${LOCATIONS_URL}/${locationId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-User": performedBy,
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

export function deleteLocation(locationId, performedBy) {
  return fetch(`${LOCATIONS_URL}/${locationId}`, {
    method: "DELETE",
    headers: {
      "X-User": performedBy,
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