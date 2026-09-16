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

  function saveUser(performedBy, token) {
    const user = {
      username: username,
      role: role,
      password: password,
    };

    return createUser(user, performedBy, token).then(() => {
      setUsername("");
      setRole("WORKER");
      setPassword("");
      fetchUsers();
    });
  }

  function changeUserRole(userId, role, performedBy, token) {
    return updateUserRole(userId, role, performedBy, token).then(() => {
      fetchUsers();
    });
  }

  function removeUser(userId, performedBy, token) {
    return deleteUser(userId, performedBy, token).then(() => {
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