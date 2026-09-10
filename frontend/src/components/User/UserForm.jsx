function UserForm({ 
  username, 
  role, 
  onUsernameChange, 
  onRoleChange, 
  onSubmit, 
  canManageUsers, 
  password,
  onPasswordChange, 
}) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>User: </label>
        <input
          type="text"
          value={username}
          onChange={(event) => onUsernameChange(event.target.value)}
          disabled={!canManageUsers}
          required
        />
      </div>

      <div>
        <label>Role: </label>
        <select
          value={role}
          onChange={(event) => onRoleChange(event.target.value)}
          disabled={!canManageUsers}
          required
        >
          <option value="ADMIN">ADMIN</option>
          <option value="MANAGER">MANAGER</option>
          <option value="WORKER">WORKER</option>
        </select>
      </div>

      <div>
        <label>Password: </label>
        <input
          type="password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          disabled={!canManageUsers}
          required
          minLength="6"
        />
      </div>

      <button type="submit" disabled={!canManageUsers}>Add User</button>
    </form>
  );
}

export default UserForm;