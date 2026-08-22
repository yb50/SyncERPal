import { useState } from "react";
import UserForm from "./UserForm";
import UserTable from "./UserTable";

function UserSection({
  users,
  username,
  role,
  setUsername,
  setRole,
  saveUser,
  changeUserRole,
  removeUser,
  currentUsername,
  canManageUsers,
  fetchAuditLogs,
  setError,
  setSuccessMessage,
}) {
  const [userSearchText, setUserSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const adminCount = users.filter((user) => user.role === "ADMIN").length;

  const filteredUsers = users.filter((user) => {
    const searchText = userSearchText.toLowerCase();

    const matchesSearch =
      userSearchText === "" ||
      user.username.toLowerCase().includes(searchText);

    const matchesRole = 
      selectedRole === "" || 
      user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  function clearUserFilters() {
    setUserSearchText("");
    setSelectedRole("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    setSuccessMessage("");

    saveUser(currentUsername)
      .then(() => {
        setError("");
        setSuccessMessage("User created successfully.");
        fetchAuditLogs();
      })
      .catch((error) => {
        setSuccessMessage("");
        setError(error.message);
      });
  }

  function handleRoleChange(userId, newRole) {
    setSuccessMessage("");

    changeUserRole(userId, newRole, currentUsername)
      .then(() => {
        setError("");
        setSuccessMessage("User role updated successfully.");
        fetchAuditLogs();
      })
      .catch((error) => {
        setSuccessMessage("");
        setError(error.message);
      });
  }

  function handleDeleteUser(userId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    setSuccessMessage("");

    removeUser(userId, currentUsername)
      .then(() => {
        setError("");
        setSuccessMessage("User deleted successfully.");
        fetchAuditLogs();
      })
      .catch((error) => {
        setSuccessMessage("");
        setError(error.message);
      });
  }

  return (
    <>
      <h2>Add User</h2>

      {!canManageUsers && (
        <p className="hint">Only ADMIN users can create new users.</p>
      )}

      <UserForm
        username={username}
        role={role}
        onUsernameChange={setUsername}
        onRoleChange={setRole}
        onSubmit={handleSubmit}
        canManageUsers={canManageUsers}
      />

      <h2>Users</h2>

      <p className="hint">
        The last ADMIN user cannot be demoted or deleted.
      </p>

      <div>
        <label>Search users: </label>
        <input
          type="text"
          value={userSearchText}
          onChange={(event) => setUserSearchText(event.target.value)}
          placeholder="Search by username"
        />
      </div>

      <div>
        <label>Filter by role: </label>
        <select
          value={selectedRole}
          onChange={(event) => setSelectedRole(event.target.value)}
        >
          <option value="">All roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="MANAGER">MANAGER</option>
          <option value="WORKER">WORKER</option>
        </select>
      </div>

      <button type="button" onClick={clearUserFilters}>
        Clear User Filters
      </button>

      <UserTable
        users={filteredUsers}
        adminCount={adminCount}
        canManageUsers={canManageUsers}
        onRoleChange={handleRoleChange}
        onDeleteUser={handleDeleteUser}
        currentUsername={currentUsername}
        emptyMessage="No users match the selected filters."
      />
    </>
  );
}

export default UserSection;