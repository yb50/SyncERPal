import { useState } from "react";
import { getLocations, createLocation, updateLocation, deleteLocation } from "../api/locationApi";

function useLocations() {
  const [locations, setLocations] = useState([]);
  const [locationCode, setLocationCode] = useState("");
  const [locationName, setLocationName] = useState("");
  const [editingLocationId, setEditingLocationId] = useState(null);

  function fetchLocations(token) {
    if (!token) {
      setLocations([]);
      return Promise.resolve();
    }

    return getLocations(token).then((data) => {
      setLocations(data);
    });
  }

  function clearLocationForm() {
    setLocationCode("");
    setLocationName("");
    setEditingLocationId(null);
  }

  function startEditLocation(location) {
    setLocationCode(location.code);
    setLocationName(location.name);
    setEditingLocationId(location.id);
  }

  function saveLocation(token) {
    const location = {
      code: locationCode,
      name: locationName,
    };

    const request =
      editingLocationId === null
        ? createLocation(location, token)
        : updateLocation(editingLocationId, location, token);

    return request.then(() => {
      clearLocationForm();
      fetchLocations(token);
    });
  }

  function removeLocation(locationId, token) {
    return deleteLocation(locationId, token).then(() => {
      fetchLocations(token);
    });
  }

  return {
    locations,
    locationCode,
    locationName,
    editingLocationId,
    setLocationCode,
    setLocationName,
    fetchLocations,
    saveLocation,
    startEditLocation,
    clearLocationForm,
    removeLocation,
  };
}

export default useLocations;