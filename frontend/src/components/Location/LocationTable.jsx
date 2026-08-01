function LocationTable({ locations, onEdit, canManageLocations }) {
  if (locations.length === 0) {
    return <p>No locations found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Code</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {locations.map((location) => (
          <tr key={location.id}>
            <td>{location.id}</td>
            <td>{location.code}</td>
            <td>{location.name}</td>
            <td>
              <button
                type="button"
                onClick={() => onEdit(location)}
                disabled={!canManageLocations}
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LocationTable;