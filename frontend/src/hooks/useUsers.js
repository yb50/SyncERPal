import { useState } from "react";
import { getUsers, createUser } from "../api/userApi";

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

  return {
    users,
    username,
    role,
    setUsername,
    setRole,
    fetchUsers,
    saveUser,
  };
}

export default useUsers;