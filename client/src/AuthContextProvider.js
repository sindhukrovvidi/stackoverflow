import React, { createContext, useState } from 'react';
// import _axios from "axios";

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
    // _axios.defaults.headers.common['Authorization'] = null;

    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};