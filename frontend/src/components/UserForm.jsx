function UserForm({ username, role, onUsernameChange, onRoleChange, onSubmit, canManageUsers }) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>User: </label>
        <input
          type="text"
          value={username}
          onChange={(event) => onUsernameChange(event.target.value)}
          disabled={!canManageUsers}
        />
      </div>

      <div>
        <label>Role: </label>
        <select
          value={role}
          onChange={(event) => onRoleChange(event.target.value)}
          disabled={!canManageUsers}
        >
          <option value="ADMIN">ADMIN</option>
          <option value="MANAGER">MANAGER</option>
          <option value="WORKER">WORKER</option>
        </select>
      </div>

      <button type="submit" disabled={!canManageUsers}>Add User</button>
    </form>
  );
}

export default UserForm;