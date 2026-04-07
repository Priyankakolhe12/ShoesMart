import { Routes, Route } from "react-router-dom";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<h1>Dashboard</h1>} />
      <Route path="/login" element={<h1>Login</h1>} />
    </Routes>
  );
}
