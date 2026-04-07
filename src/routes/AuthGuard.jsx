import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AuthGuard({ children }) {
  const { authenticated, loading } = useContext(AuthContext);

  if (loading) return <h2>Loading...</h2>;

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
