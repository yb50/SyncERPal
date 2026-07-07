function UserForm({ username, role, onUsernameChange, onRoleChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>User: </label>
        <input
          type="text"
          value={username}
          onChange={(event) => onUsernameChange(event.target.value)}
        />
      </div>

      <div>
        <label>Role: </label>
        <select
          value={role}
          onChange={(event) => onRoleChange(event.target.value)}
        >
          <option value="ADMIN">ADMIN</option>
          <option value="MANAGER">MANAGER</option>
          <option value="WORKER">WORKER</option>
        </select>
      </div>

      <button type="submit">Add User</button>
    </form>
  );
}

export default UserForm;