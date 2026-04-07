import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import AuthGuard from "./AuthGuard";
import KycGuard from "./KycGuard";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <AuthGuard>
            <KycGuard>
              <h1>Dashboard</h1>
            </KycGuard>
          </AuthGuard>
        }
      />
    </Routes>
  );
}
