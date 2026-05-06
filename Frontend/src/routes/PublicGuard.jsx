import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import PageLoader from "../components/common/PageLoader";

export default function PublicGuard() {
  const { user, loading } = useContext(AuthContext);

  /* 🔄 LOADING */
  if (loading) {
    return <PageLoader fullScreen />;
  }

  /* 🔐 ALREADY LOGGED IN */
  if (user && user.id) {
    const kycStatus = user?.kyc?.status;

    /* 🔥 NO HOOK NEEDED */
    let redirectPath = "/";

    if (!kycStatus || kycStatus === "rejected") {
      redirectPath = "/kyc";
    } else if (kycStatus === "pending") {
      redirectPath = "/kyc-status";
    } else if (kycStatus === "approved") {
      redirectPath = "/";
    }

    return <Navigate to={redirectPath} replace />;
  }

  /* ✅ PUBLIC ACCESS */
  return <Outlet />;
}
