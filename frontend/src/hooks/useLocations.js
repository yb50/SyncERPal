import { useState } from "react";
import { getLocations, createLocation, updateLocation, deleteLocation } from "../api/locationApi";

function useLocations() {
  const [locations, setLocations] = useState([]);
  const [locationCode, setLocationCode] = useState("");
  const [locationName, setLocationName] = useState("");
  const [editingLocationId, setEditingLocationId] = useState(null);

  function fetchLocations() {
    return getLocations().then((data) => {
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

  function saveLocation(performedBy) {
    const location = {
      code: locationCode,
      name: locationName,
    };

    const request =
      editingLocationId === null
        ? createLocation(location, performedBy)
        : updateLocation(editingLocationId, location, performedBy);

    return request.then(() => {
      clearLocationForm();
      fetchLocations();
    });
  }

  function removeLocation(locationId, performedBy) {
    return deleteLocation(locationId, performedBy).then(() => {
      fetchLocations();
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