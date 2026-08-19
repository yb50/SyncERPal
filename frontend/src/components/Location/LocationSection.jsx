import LocationForm from "./LocationForm";
import LocationTable from "./LocationTable";

function LocationSection({
  locations,
  locationCode,
  locationName,
  stockMovements,
  inventoryBalances,
  stockTransfers,
  editingLocationId,
  setLocationCode,
  setLocationName,
  saveLocation,
  startEditLocation,
  clearLocationForm,
  currentUsername,
  canManageLocations,
  fetchAuditLogs,
  setError,
  removeLocation,
  setSuccessMessage,
}) {
  function handleSubmit(event) {
    event.preventDefault();

    setSuccessMessage("");

    saveLocation(currentUsername)
      .then(() => {
        setError("");
        setSuccessMessage(
          editingLocationId === null
            ? "Location created successfully."
            : "Location updated successfully."
        );
        fetchAuditLogs();
      })
      .catch((error) => {
        setSuccessMessage("");
        setError(error.message);
      });
  }

  function handleEdit(location) {
    startEditLocation(location);
    setError("");
  }

  function handleCancelEdit() {
    clearLocationForm();
    setError("");
  }

  function handleDelete(locationId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this location?"
    );

    if (!confirmed) {
      return;
    }

    setSuccessMessage("");

    removeLocation(locationId, currentUsername)
      .then(() => {
        setError("");
        setSuccessMessage("Location deleted successfully.");
        fetchAuditLogs();
      })
      .catch((error) => {
        setSuccessMessage("");
        setError(error.message);
      });
  }

  return (
    <>
      <h2>{editingLocationId === null ? "Add Location" : "Edit Location"}</h2>

      {!canManageLocations && (
        <p className="hint">
          Only ADMIN and MANAGER users can create or edit locations.
        </p>
      )}

      <LocationForm
        locationCode={locationCode}
        locationName={locationName}
        editingLocationId={editingLocationId}
        onLocationCodeChange={setLocationCode}
        onLocationNameChange={setLocationName}
        onSubmit={handleSubmit}
        onCancelEdit={handleCancelEdit}
        canManageLocations={canManageLocations}
      />

      <h2>Locations</h2>

      <p className="hint">
        Locations with inventory history cannot be deleted.
      </p>

      <LocationTable
        locations={locations}
        stockMovements={stockMovements}
        inventoryBalances={inventoryBalances}
        stockTransfers={stockTransfers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canManageLocations={canManageLocations}
      />
    </>
  );
}

export default LocationSection;