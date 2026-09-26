import { handleApiResponse } from "./apiError";
import { BASE_URL } from "./config";

const LOCATIONS_URL = `${BASE_URL}/locations`;

export function getLocations(token) {
  return fetch(LOCATIONS_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) =>
      handleApiResponse(response, "Failed to fetch locations.")
    )
    .then((response) => response.json());
}

export function createLocation(location, token) {
  return fetch(LOCATIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(location),
  })
    .then((response) =>
      handleApiResponse(response, "Failed to create location.")
    )
    .then((response) => response.json());
}

export function updateLocation(locationId, location, token) {
  return fetch(`${LOCATIONS_URL}/${locationId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(location),
  })
    .then((response) =>
      handleApiResponse(response, "Failed to update location.")
    )
    .then((response) => response.json());
}

export function deleteLocation(locationId, token) {
  return fetch(`${LOCATIONS_URL}/${locationId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) =>
      handleApiResponse(response, "Failed to delete location.")
    )
    .then((response) => response.json());
}