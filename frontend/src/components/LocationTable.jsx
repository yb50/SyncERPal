function LocationTable({ locations }) {
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
        </tr>
      </thead>

      <tbody>
        {locations.map((location) => (
          <tr key={location.id}>
            <td>{location.id}</td>
            <td>{location.code}</td>
            <td>{location.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LocationTable;