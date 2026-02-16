import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("syncerpal_token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("syncerpal_user");
    return raw ? JSON.parse(raw) : null;
  });

  function login(accessToken, userInfo) {
    setToken(accessToken);
    setUser(userInfo);

    localStorage.setItem("syncerpal_token", accessToken);
    localStorage.setItem("syncerpal_user", JSON.stringify(userInfo));
  }

  function logout() {
    setToken(null);
    setUser(null);

    localStorage.removeItem("syncerpal_token");
    localStorage.removeItem("syncerpal_user");
  }

  const value = useMemo(() => ({ token, user, login, logout }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
