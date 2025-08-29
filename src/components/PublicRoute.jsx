import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If token exists, redirect to Home
  if (token) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the children (public component)
  return children;
};

export default PublicRoute;
