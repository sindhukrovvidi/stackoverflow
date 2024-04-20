import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('stackOverflowJwtToken') ? true : false
  );

  const signIn = () => {
    setIsAuthenticated(true);
  };

  const signOutAuth = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOutAuth }}>
      {children}
    </AuthContext.Provider>
  );
};