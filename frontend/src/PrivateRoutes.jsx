import { isAuthenticated } from "./components/Auth/auth";
import { Navigate } from "react-router-dom";
export function PrivateRoute({ children }) {
  return isAuthenticated() ? children  : <Navigate to="/login"/>;
}
