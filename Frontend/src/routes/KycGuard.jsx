import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import PageLoader from "../components/common/PageLoader";

export default function KycGuard() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  const from = location.pathname + location.search;

  /* =============================
     🔄 LOADING
  ============================= */
  if (loading) {
    return <PageLoader fullScreen />;
  }

  /* =============================
     🔐 NOT AUTHENTICATED
  ============================= */
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

  /* =============================
     🔍 SAFE STATUS EXTRACTION
  ============================= */
  if (!user || !user.id) {
    return <Navigate to="/login" replace />;
  }

  const status = user?.kyc?.status ?? "not_started";

  /* =============================
     🔁 ROUTE DECISION
  ============================= */
  let redirectPath = null;

  if (status === "not_started" || status === "rejected") {
    redirectPath = "/kyc";
  } else if (status === "pending") {
    redirectPath = "/kyc-status";
  } else if (status === "approved") {
    redirectPath = null; // allow
  }

  /* =============================
     🚫 PREVENT LOOP + REDIRECT
  ============================= */
  if (redirectPath && location.pathname !== redirectPath) {
    return (
      <Navigate
        to={redirectPath}
        replace
        state={{
          from,
          reason: "kyc_required",
          status,
        }}
      />
    );
  }

  /* =============================
     ✅ ACCESS GRANTED
  ============================= */
  return <Outlet />;
}
