import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [csrfToken, setCsrfToken] = useState('');

  const signIn = () => {
    setLoggedIn(true);
  };

  const signOutAuth = () => {
    setLoggedIn(false);
  };

  const updateCsrfToken = (token) => {
    setCsrfToken(token)
  }

  const updateUser = (user) => {
    setUser(user)
  }

  return (
    <AuthContext.Provider value={{ loggedIn, signIn, signOutAuth, updateUser, updateCsrfToken, csrfToken, user }}>
      {children}
    </AuthContext.Provider>
  );
};