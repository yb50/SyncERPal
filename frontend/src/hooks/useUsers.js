import { useState } from "react";
import { getUsers, setupFirstUser , createUser, updateUserRole, deleteUser } from "../api/userApi";
import { getSetupStatus } from "../api/authApi";

function useUsers() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("WORKER");
  const [password, setPassword] = useState("");
  const [setupRequired, setSetupRequired] = useState(false);

  function fetchSetupStatus() {
    return getSetupStatus().then((data) => {
      setSetupRequired(data.setupRequired);
    });
  }

  function fetchUsers(token) {
    if (!token) {
      setUsers([]);
      return Promise.resolve();
    }

    return getUsers(token).then((data) => {
      setUsers(data);
    });
  }

  function saveUser(token) {
    const user = {
      username: username,
      role: role,
      password: password,
    };

    const saveUserRequest = setupRequired 
      ? setupFirstUser(user)
      : createUser(user, token);

    return saveUserRequest.then(() => {
      setUsername("");
      setRole("WORKER");
      setPassword("");

      fetchUsers(token);
      fetchSetupStatus();
    });
  }

  function changeUserRole(userId, role, token) {
    return updateUserRole(userId, role, token).then(() => {
      fetchUsers(token);
    });
  }

  function removeUser(userId, token) {
    return deleteUser(userId, token).then(() => {
      fetchUsers(token);
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
    setupRequired,
    fetchSetupStatus,
  };
}

export default useUsers;