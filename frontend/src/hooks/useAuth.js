import { useState } from "react";
import { loginUser } from "../api/authApi";

function useAuth() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  function login() {
    const credentials = {
      username: loginUsername,
      password: loginPassword,
    };

    return loginUser(credentials).then((data) => {
      setLoggedInUser(data);
      setLoginPassword("");
    });
  }

  function logout() {
    setLoggedInUser(null);
    setLoginUsername("");
    setLoginPassword("");
  }

  return {
    loggedInUser,
    loginUsername,
    loginPassword,
    setLoginUsername,
    setLoginPassword,
    login,
    logout,
  };
}

export default useAuth;