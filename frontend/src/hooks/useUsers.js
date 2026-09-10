import { useState } from "react";
import { getUsers, createUser, updateUserRole, deleteUser } from "../api/userApi";

function useUsers() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("WORKER");
  const [password, setPassword] = useState("");

  function fetchUsers() {
    return getUsers().then((data) => {
      setUsers(data);
    });
  }

  function saveUser(performedBy) {
    const user = {
      username: username,
      role: role,
      password: password,
    };

    return createUser(user, performedBy).then(() => {
      setUsername("");
      setRole("WORKER");
      setPassword("");
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
    password,
    setUsername,
    setRole,
    fetchUsers,
    saveUser,
    changeUserRole,
    removeUser,
    setPassword,
  };
}

export default useUsers;