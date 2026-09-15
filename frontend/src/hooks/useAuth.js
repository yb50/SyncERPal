import { useEffect, useState } from "react";
import { getCurrentUser, loginUser } from "../api/authApi";

const AUTH_TOKEN_STORAGE_KEY = "syncerpalAuthToken";

function useAuth() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

    if (!savedToken) {
      setAuthLoading(false);
      return;
    }

    getCurrentUser(savedToken)
      .then((user) => {
        setLoggedInUser({
          ...user,
          token: savedToken,
        });
      })
      .catch(() => {
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        setLoggedInUser(null);
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, []);

  function login() {
    const credentials = {
      username: loginUsername,
      password: loginPassword,
    };

    return loginUser(credentials).then((data) => {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, data.token);

      setLoggedInUser(data);
      setLoginPassword("");

      return data;
    });
  }

  function logout() {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);

    setLoggedInUser(null);
    setLoginUsername("");
    setLoginPassword("");
  }

  return {
    loggedInUser,
    loginUsername,
    loginPassword,
    authLoading,
    setLoginUsername,
    setLoginPassword,
    login,
    logout,
  };
}

export default useAuth;