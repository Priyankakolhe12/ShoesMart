import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function KycGuard({ children }) {
  const { user } = useContext(AuthContext);

  if (!user?.kycStatus) {
    return <Navigate to="/kyc" replace />;
  }

  if (user?.kycStatus === "pending") {
    return <Navigate to="/kyc-status" replace />;
  }

  if (user?.kycStatus === "rejected") {
    return <Navigate to="/kyc" replace />;
  }

  return children;
}
