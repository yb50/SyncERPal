import { useMemo, useState } from "react";
import UserForm from "./UserForm";
import UserTable from "./UserTable";
import PaginationControls from "../PaginationControls";
import SortControls from "../SortControls";

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
  handleApiError,
  setSuccessMessage,
  password,
  setPassword,
  authToken,
  setupRequired,
}) {
  const [userSearchText, setUserSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("username");
  const [sortDirection, setSortDirection] = useState("asc");

  const pageSize = 10;

  // + Filtering

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

  // - Filtering

  // + Sorting

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      const aText = String(aValue ?? "").toLowerCase();
      const bText = String(bValue ?? "").toLowerCase();

      return sortDirection === "asc"
        ? aText.localeCompare(bText)
        : bText.localeCompare(aText);
    });
  }, [filteredUsers, sortBy, sortDirection]);

  // - Sorting

  // + Pagination

  const totalPages = Math.ceil(sortedUsers.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;

  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + pageSize);

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

    saveUser(authToken)
      .then(() => {
        setError("");
        setSuccessMessage("User created successfully.");
        fetchAuditLogs(authToken);
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  function handleRoleChange(userId, role) {
    setSuccessMessage("");

    changeUserRole(userId, role, authToken)
      .then(() => {
        setError("");
        setSuccessMessage("User role updated successfully.");
        fetchAuditLogs(authToken);
      })
      .catch((error) => {
        handleApiError(error);
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

    removeUser(userId, authToken)
      .then(() => {
        setError("");
        setSuccessMessage("User deleted successfully.");
        fetchAuditLogs(authToken);
      })
      .catch((error) => {
        handleApiError(error);
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
        setupRequired={setupRequired}
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

      <SortControls
        sortBy={sortBy}
        sortDirection={sortDirection}
        sortOptions={[
          { value: "username", label: "Username" },
          { value: "role", label: "Role" },
        ]}
        onSortByChange={(value) => {
          setSortBy(value);
          setCurrentPage(1);
        }}
        onSortDirectionChange={(value) => {
          setSortDirection(value);
          setCurrentPage(1);
        }}
      />

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