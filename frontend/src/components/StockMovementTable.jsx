function StockMovementTable({ stockMovements }) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Item ID</th>
          <th>Type</th>
          <th>Quantity</th>
          <th>Note</th>
        </tr>
      </thead>

      <tbody>
        {stockMovements.map((movement) => (
          <tr key={movement.id}>
            <td>{movement.id}</td>
            <td>{movement.itemId}</td>
            <td>{movement.type}</td>
            <td>{movement.quantity}</td>
            <td>{movement.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default StockMovementTable;