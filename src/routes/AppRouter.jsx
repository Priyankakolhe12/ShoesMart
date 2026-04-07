import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import AuthGuard from "./AuthGuard";
import KycGuard from "./KycGuard";
import KycForm from "../pages/KYC/KycForm";
import KycStatus from "../pages/KYC/KycStatus";
import ProductList from "../pages/Product/ProductList";
import Cart from "../pages/Cart/Cart";
import Layout from "../components/layout/Layout";
import Checkout from "../pages/Checkout/Checkout";

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
      <Route
        path="/kyc"
        element={
          <AuthGuard>
            <KycForm />
          </AuthGuard>
        }
      />
      <Route
        path="/kyc-status"
        element={
          <AuthGuard>
            <KycStatus />
          </AuthGuard>
        }
      />
      <Route
        path="/"
        element={
          <AuthGuard>
            <KycGuard>
              <ProductList />
            </KycGuard>
          </AuthGuard>
        }
      />
      <Route
        path="/cart"
        element={
          <AuthGuard>
            <KycGuard>
              <Cart />
            </KycGuard>
          </AuthGuard>
        }
      />
      <Route
        path="/"
        element={
          <AuthGuard>
            <KycGuard>
              <Layout>
                <ProductList />
              </Layout>
            </KycGuard>
          </AuthGuard>
        }
      />
      <Route
        path="/checkout"
        element={
          <AuthGuard>
            <KycGuard>
              <Layout>
                <Checkout />
              </Layout>
            </KycGuard>
          </AuthGuard>
        }
      />
    </Routes>
  );
}
