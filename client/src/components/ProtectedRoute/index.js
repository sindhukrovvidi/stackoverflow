import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../../AuthContextProvider';
import { useContext } from "react";
import Login from '../Login';

const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? <Outlet /> : <Login navigateTo={'/answer'}/>;
};

export default ProtectedRoute;
