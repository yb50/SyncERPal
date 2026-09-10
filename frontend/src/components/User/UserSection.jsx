import { useState } from "react";
import UserForm from "./UserForm";
import UserTable from "./UserTable";
import PaginationControls from "../PaginationControls";

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
  password,
  setPassword,
}) {
  const [userSearchText, setUserSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

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

  // + Pagination

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;

  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  function resetToFirstPage() {
    setCurrentPage(1);
  }

  function goToPreviousPage() {
    setCurrentPage((page) => Math.max(page - 1, 1));
  }

  function goToNextPage() {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  }

  // - Pagination

  function clearUserFilters() {
    setUserSearchText("");
    setSelectedRole("");
    setCurrentPage(1);
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
        password={password}
        onUsernameChange={setUsername}
        onRoleChange={setRole}
        onPasswordChange={setPassword}
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
          onChange={(event) => {
            setUserSearchText(event.target.value);
            resetToFirstPage();
          }}
          placeholder="Search by username"
        />
      </div>

      <div>
        <label>Filter by role: </label>
        <select
          value={selectedRole}
          onChange={(event) => {
            setSelectedRole(event.target.value);
            resetToFirstPage();
          }}
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

      <p className="table-summary">
        Showing {paginatedUsers.length} of {filteredUsers.length} users
      </p>

      <UserTable
        users={paginatedUsers}
        adminCount={adminCount}
        canManageUsers={canManageUsers}
        onRoleChange={handleRoleChange}
        onDeleteUser={handleDeleteUser}
        currentUsername={currentUsername}
        emptyMessage="No users match the selected filters."
      />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPreviousPage={goToPreviousPage}
        onNextPage={goToNextPage}
      />
    </>
  );
}

export default UserSection;