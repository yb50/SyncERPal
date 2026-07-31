function LocationForm({
  locationCode,
  locationName,
  onLocationCodeChange,
  onLocationNameChange,
  onSubmit,
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
        />
      </div>

      <div>
        <label>Name: </label>
        <input
          type="text"
          value={locationName}
          onChange={(event) => onLocationNameChange(event.target.value)}
          disabled={!canManageLocations}
        />
      </div>

      <button type="submit" disabled={!canManageLocations}>
        Add Location
      </button>
    </form>
  );
}

export default LocationForm;