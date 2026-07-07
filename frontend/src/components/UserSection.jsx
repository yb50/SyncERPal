import UserForm from "./UserForm";
import UserTable from "./UserTable";

function UserSection({
  users,
  username,
  role,
  setUsername,
  setRole,
  saveUser,
  setError,
}) {
  function handleSubmit(event) {
    event.preventDefault();

    saveUser()
      .then(() => {
        setError("");
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <>
      <h2>Add User</h2>

      <UserForm
        username={username}
        role={role}
        onUsernameChange={setUsername}
        onRoleChange={setRole}
        onSubmit={handleSubmit}
      />

      <h2>Users</h2>

      <UserTable users={users} />
    </>
  );
}

export default UserSection;