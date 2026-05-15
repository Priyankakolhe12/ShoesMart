import { AuthContext } from "./AuthContext";
import { useState, useEffect, useCallback, useMemo } from "react";
import * as authApi from "../api/authApi";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =============================
     MAP USER
  ============================= */
  const mapUser = (data) => ({
    id: data.id || data._id,
    name: data.name,
    email: data.email,
    role: data.role,
    kyc: {
      status: data?.kyc?.status ?? "not_started",
      ...data?.kyc,
    },
  });

  /* =============================
     SET SESSION
  ============================= */
  const setSession = (mappedUser, token) => {
    if (token) {
      localStorage.setItem("token", token);
    }

    localStorage.setItem("userId", String(mappedUser.id));
    localStorage.setItem("userData", JSON.stringify(mappedUser));
    setUser(mappedUser);
  };

  /* =============================
     LOGOUT
  ============================= */
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn("Logout failed on server:", error);
    }

    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userData");
  }, []);

  /* =============================
     RESTORE SESSION
  ============================= */
  const me = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const cached = localStorage.getItem("userData");
      if (cached) {
        setUser(JSON.parse(cached));
      }

      const result = await authApi.getMe();
      const fresh = result?.user;

      if (!fresh) {
        logout();
        return;
      }

      setSession(mapUser(fresh));
    } catch (error) {
      console.error("Session restore failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    me();
  }, []);

  /* =============================
     LOGIN
  ============================= */
  const login = useCallback(async (data) => {
    try {
      const response = await authApi.login({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      const userData = response?.user;
      const accessToken = response?.accessToken;

      if (!userData || !accessToken) {
        return {
          success: false,
          message: response?.message || "Invalid credentials",
        };
      }

      const mapped = mapUser(userData);
      setSession(mapped, accessToken);

      return {
        success: true,
        user: mapped,
        kycStatus: mapped.kyc?.status,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error?.message || "Login failed",
      };
    }
  }, []);

  /* =============================
     REGISTER
  ============================= */
  const createProfile = useCallback(async (data) => {
    try {
      await authApi.register({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        role: "customer",
      });

      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message:
          error?.message || error?.data?.message || "Registration failed",
      };
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const result = await authApi.getMe();
      const fresh = result?.user;

      if (fresh) {
        const mapped = mapUser(fresh);
        setSession(mapped);
        return mapped;
      }
    } catch (err) {
      console.error("Refresh user failed:", err);
    }

    return null;
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      createProfile,
      refreshUser,
      loading,
      authenticated: !!user?.id,
    }),
    [user, loading, login, logout, createProfile, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
