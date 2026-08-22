function LocationForm({
  locationCode,
  locationName,
  editingLocationId,
  onLocationCodeChange,
  onLocationNameChange,
  onSubmit,
  onCancelEdit,
  canManageLocations,
}) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Code: </label>
        <input
          type="text"
          value={locationCode}
          onChange={(event) => onLocationCodeChange(event.target.value)}
          disabled={!canManageLocations}
          required
        />
      </div>

      <div>
        <label>Name: </label>
        <input
          type="text"
          value={locationName}
          onChange={(event) => onLocationNameChange(event.target.value)}
          disabled={!canManageLocations}
          required
        />
      </div>

      <button type="submit" disabled={!canManageLocations}>
        {editingLocationId === null ? "Add Location" : "Update Location"}
      </button>

      {editingLocationId !== null && (
        <button type="button" onClick={onCancelEdit}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default LocationForm;