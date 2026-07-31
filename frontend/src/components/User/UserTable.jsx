function UserTable({ users, canManageUsers, onRoleChange, onDeleteUser, currentUsername }) {
  if (users.length === 0) {
    return <p>No users found.</p>;
  }

  const adminCount = users.filter((user) => user.role === "ADMIN").length;

  function isLastAdmin(user) {
    return user.role === "ADMIN" && adminCount <= 1;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Role</th>
          <th>Actions</th>
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
                disabled={!canManageUsers || isLastAdmin(user)}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="WORKER">WORKER</option>
              </select>
            </td>
            <td>
              <button
                onClick={() => onDeleteUser(user.id)}
                disabled={!canManageUsers || user.username === currentUsername || isLastAdmin(users)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UserTable;