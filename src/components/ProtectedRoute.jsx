import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If no token, redirect to SignIn
  if (!token) {
    return <Navigate to="/signIn" replace />;
  }

  // Otherwise, render the children (protected component)
  return children;
};

export default ProtectedRoute;
