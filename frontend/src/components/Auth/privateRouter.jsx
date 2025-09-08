import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth";

export default function PrivateRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/Login" replace />;
  }
  return children;
}
