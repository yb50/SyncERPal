function ItemTable({items, onEdit, onDelete}) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>SKU</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.sku}</td>
            <td>{item.name}</td>
            <td>
              <button onClick={() => onEdit(item)}>Edit</button>
              <button onClick={() => onDelete(item.id)}>Delete</button>
            </td>
          </tr>
        ))}        
      </tbody>
    </table>
  );
}

export default ItemTable;