import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authenticateUser, clearSessionUser, getSessionUser, registerUser } from "../services/localStore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getSessionUser());

  useEffect(() => {
    setUser(getSessionUser());
  }, []);

  const value = useMemo(() => {
    const logIn = (payload) => {
      const session = payload?.authToken && payload?.email ? payload : authenticateUser(payload);
      setUser(session);
      return session;
    };

    const signUp = (payload) => {
      const session = registerUser(payload);
      setUser(session);
      return session;
    };

    const logOut = () => {
      clearSessionUser();
      setUser(null);
    };

    return {
      user,
      logIn,
      signUp,
      logOut,
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
