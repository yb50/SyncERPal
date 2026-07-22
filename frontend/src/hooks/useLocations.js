import { useState } from "react";
import { getLocations, createLocation } from "../api/locationApi";

function useLocations() {
  const [locations, setLocations] = useState([]);
  const [locationCode, setLocationCode] = useState("");
  const [locationName, setLocationName] = useState("");

  function fetchLocations() {
    return getLocations().then((data) => {
      setLocations(data);
    });
  }

  function saveLocation(performedBy) {
    const location = {
      code: locationCode,
      name: locationName,
    };

    return createLocation(location, performedBy).then(() => {
      setLocationCode("");
      setLocationName("");
      fetchLocations();
    });
  }

  return {
    locations,
    locationCode,
    locationName,
    setLocationCode,
    setLocationName,
    fetchLocations,
    saveLocation,
  };
}

export default useLocations;