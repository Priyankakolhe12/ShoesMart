import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import PageLoader from "../components/common/PageLoader";

export default function CustomerGuard() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <PageLoader fullScreen />;
  }

  if (!user || !user.id) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
