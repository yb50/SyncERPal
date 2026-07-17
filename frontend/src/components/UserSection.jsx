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
}) {
  function handleSubmit(event) {
    event.preventDefault();

    saveUser(currentUsername)
      .then(() => {
        setError("");
        fetchAuditLogs();
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function handleRoleChange(userId, newRole) {
    changeUserRole(userId, newRole, currentUsername)
      .then(() => {
        setError("");
        fetchAuditLogs();
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function handleDeleteUser(userId) {
    removeUser(userId, currentUsername)
      .then(() => {
        setError("");
        fetchAuditLogs();
      })
      .catch((error) => {
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
    </>
  );
}

export default UserSection;