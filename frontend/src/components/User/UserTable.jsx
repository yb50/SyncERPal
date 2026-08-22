function UserTable({
  users,
  adminCount,
  canManageUsers,
  onRoleChange,
  onDeleteUser,
  currentUsername,
  emptyMessage = "No users found.",
}) {
  function isLastAdmin(user) {
    return user.role === "ADMIN" && adminCount <= 1;
  }

  if (users.length === 0) {
    return <p>{emptyMessage}</p>;
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
                type="button"
                onClick={() => onDeleteUser(user.id)}
                disabled={
                  !canManageUsers ||
                  user.username === currentUsername ||
                  isLastAdmin(user)
                }
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