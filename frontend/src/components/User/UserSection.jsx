import UserForm from "./UserForm";
import UserTable from "./UserTable";

function UserSection({
  users,
  username,
  role,
  setUsername,
  setRole,
  saveUser,
  currentUsername,
  canManageUsers,
  fetchAuditLogs,
  setError,
  changeUserRole,
  removeUser,
  setSuccessMessage,
}) {
  function handleSubmit(event) {
    event.preventDefault();

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

      <UserTable 
        users={users}
        canManageUsers={canManageUsers} 
        onRoleChange={handleRoleChange}
        onDeleteUser={handleDeleteUser}
        currentUsername={currentUsername}
      />

      <p className="hint">
        The last ADMIN user cannot be demoted or deleted.
      </p>
    </>
  );
}

export default UserSection;