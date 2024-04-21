import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");

  const updateUser = (user) => {
    setUser(user)
  }

  return (
    <AuthContext.Provider value={{ updateUser, user }}>
      {children}
    </AuthContext.Provider>
  );
};