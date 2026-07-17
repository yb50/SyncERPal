import { useState } from "react";
import { getUsers, createUser, updateUserRole, deleteUser } from "../api/userApi";

function useUsers() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("WORKER");

  function fetchUsers() {
    return getUsers().then((data) => {
      setUsers(data);
    });
  }

  function saveUser(performedBy) {
    const user = {
      username: username,
      role: role,
    };

    return createUser(user, performedBy).then(() => {
      setUsername("");
      setRole("WORKER");
      fetchUsers();
    });
  }

  function changeUserRole(userId, role, performedBy) {
    return updateUserRole(userId, role, performedBy).then(() => {
      fetchUsers();
    });
  }

  function removeUser(userId, performedBy) {
    return deleteUser(userId, performedBy).then(() => {
      fetchUsers();
    });
  }

  return {
    users,
    username,
    role,
    setUsername,
    setRole,
    fetchUsers,
    saveUser,
    changeUserRole,
    removeUser,
  };
}

export default useUsers;