import LocationForm from "./LocationForm";
import LocationTable from "./LocationTable";

function LocationSection({
  locations,
  locationCode,
  locationName,
  setLocationCode,
  setLocationName,
  saveLocation,
  currentUsername,
  canManageLocations,
  fetchAuditLogs,
  setError,
}) {
  function handleSubmit(event) {
    event.preventDefault();

    saveLocation(currentUsername)
      .then(() => {
        setError("");
        fetchAuditLogs();
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <>
      <h2>Add Location</h2>

      {!canManageLocations && (
        <p className="hint">
          Only ADMIN and MANAGER users can create locations.
        </p>
      )}

      <LocationForm
        locationCode={locationCode}
        locationName={locationName}
        onLocationCodeChange={setLocationCode}
        onLocationNameChange={setLocationName}
        onSubmit={handleSubmit}
        canManageLocations={canManageLocations}
      />

      <h2>Locations</h2>

      <LocationTable locations={locations} />
    </>
  );
}

export default LocationSection;