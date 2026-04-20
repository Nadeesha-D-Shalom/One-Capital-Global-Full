import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const stored = localStorage.getItem("admin_user");

  if (!stored) return <Navigate to="/admin" />;

  try {
    const admin = JSON.parse(stored);
    return (admin && admin.id) ? children : <Navigate to="/admin" />;
  } catch {
    localStorage.removeItem("admin_user");
    return <Navigate to="/admin" />;
  }
};

export default ProtectedRoute;