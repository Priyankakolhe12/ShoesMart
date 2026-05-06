import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import PageLoader from "../components/common/PageLoader";

import AuthGuard from "./AuthGuard";
import KycGuard from "./KycGuard";
import PublicGuard from "./PublicGuard";
import Layout from "../components/layout/Layout";

/* ADMIN */
import AdminPanel from "../pages/Admin/AdminPanel";

/* LAZY */
const Login = lazy(() => import("../pages/Auth/Login"));
const Register = lazy(() => import("../pages/Auth/Register"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword"));

const KycForm = lazy(() => import("../pages/KYC/KycForm"));
const KycStatus = lazy(() => import("../pages/KYC/KycStatus"));
const KycReview = lazy(() => import("../pages/KYC/KycReview"));

const ProductList = lazy(() => import("../pages/Product/ProductList"));
const ProductDetails = lazy(() => import("../pages/Product/ProductDetails"));

const Cart = lazy(() => import("../pages/Cart/Cart"));
const Checkout = lazy(() => import("../pages/Checkout/Checkout"));

const OrderHistory = lazy(() => import("../pages/Orders/OrderHistory"));
const OrderSuccess = lazy(() => import("../pages/Orders/OrderSuccess"));

/* =============================
   SCROLL TO TOP (UX)
============================= */
function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader fullScreen />}>
      <ScrollToTop />

      <Routes>
        {/* =============================
            🔓 PUBLIC AUTH
        ============================= */}
        <Route element={<PublicGuard />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* =============================
            🌍 MAIN APP
        ============================= */}
        <Route element={<Layout />}>
          {/* PUBLIC */}
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />

          {/* AUTH REQUIRED */}
          <Route element={<AuthGuard />}>
            <Route path="/kyc" element={<KycForm />} />
            <Route path="/kyc-status" element={<KycStatus />} />
            <Route path="/kyc-review" element={<KycReview />} />

            {/* AUTH + KYC */}
            <Route element={<KycGuard />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/order-success" element={<OrderSuccess />} />
            </Route>
          </Route>

          {/* ADMIN */}
          <Route element={<AuthGuard requiredRole="admin" />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
        </Route>

        {/* =============================
            ❌ 404
        ============================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

/* =============================
   🔥 404 PAGE (UPGRADED)
============================= */
function NotFound() {
  return (
    <Box
      textAlign="center"
      mt={10}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <Typography variant="h2" fontWeight="bold">
        404
      </Typography>

      <Typography variant="h6" color="text.secondary">
        Oops! Page not found
      </Typography>

      <Button
        variant="contained"
        onClick={() => (window.location.href = "/")}
        sx={{ mt: 2 }}
      >
        Go Home
      </Button>
    </Box>
  );
}
