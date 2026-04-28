import { useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import PageLoader from "../components/common/PageLoader";

export default function AuthGuard({ requiredRole }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  const from = location.pathname + location.search;

  /* ✅ ALWAYS CALL HOOKS FIRST */
  const hasAccess = useMemo(() => {
    if (!requiredRole) return true;

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    return roles.includes(user?.role);
  }, [requiredRole, user]);

  /* 🔄 LOADING */
  if (loading) {
    return <PageLoader fullScreen />;
  }

  /* 🔐 NOT LOGGED IN */
  if (!user || !user.id) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from,
          reason: "unauthenticated",
        }}
      />
    );
  }

  /* 🚫 NO ACCESS */
  if (!hasAccess) {
    return <Navigate to="/" replace state={{ reason: "unauthorized" }} />;
  }

  /* ✅ ACCESS */
  return <Outlet />;
}
