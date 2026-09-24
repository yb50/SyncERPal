import { useState } from "react";
import { getUsers, setupFirstUser , createUser, updateUserRole, deleteUser } from "../api/userApi";

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

  function saveUser(token) {
    const user = {
      username: username,
      role: role,
      password: password,
    };

    const saveUserRequest = 
      users.length === 0 ? setupFirstUser(user) : createUser(user, token);

    return saveUserRequest.then(() => {
      setUsername("");
      setRole("WORKER");
      setPassword("");
      fetchUsers();
    });
  }

  function changeUserRole(userId, role, token) {
    return updateUserRole(userId, role, token).then(() => {
      fetchUsers();
    });
  }

  function removeUser(userId, token) {
    return deleteUser(userId, token).then(() => {
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