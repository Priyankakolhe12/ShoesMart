import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<h1>Dashboard</h1>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
