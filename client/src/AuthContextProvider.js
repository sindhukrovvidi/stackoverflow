import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('stackOverflowJwtToken') ? true : false
  );

  const signIn = (token) => {
    localStorage.setItem('stackOverflowJwtToken', token)
    setIsAuthenticated(true);
  };

  const signOut = () => {
    localStorage.removeItem('stackOverflowJwtToken');

    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};