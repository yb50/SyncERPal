function UserTable({ users, canManageUsers, onRoleChange }) {
  if (users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Role</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>
              <select
                value={user.role}
                onChange={(event) => onRoleChange(user.id, event.target.value)}
                disabled={!canManageUsers}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="WORKER">WORKER</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UserTable;