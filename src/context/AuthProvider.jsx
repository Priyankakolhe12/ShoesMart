import { AuthContext } from "./AuthContext";
import { useState, useEffect, useCallback, useMemo } from "react";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { getUserByEmail, getUserById, createUser } from "../api/userApi";
import api from "../api/axios";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =============================
     MAP USER
  ============================= */
  const mapUser = (data) => ({
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    kyc: {
      status: data?.kyc?.status ?? "not_started",
      ...data?.kyc,
    },
  });

  /* =============================
     SET SESSION (SIMPLIFIED)
  ============================= */
  const setSession = (mappedUser) => {
    localStorage.setItem("userId", String(mappedUser.id));
    localStorage.setItem("userData", JSON.stringify(mappedUser));
    setUser(mappedUser);
  };

  /* =============================
     LOGOUT (SAFE)
  ============================= */
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("userData");
  }, []);

  /* =============================
     RESTORE SESSION (FIXED)
  ============================= */
  const me = async () => {
    try {
      const id = localStorage.getItem("userId");

      if (!id) {
        setLoading(false);
        return;
      }

      const cached = localStorage.getItem("userData");

      if (cached) {
        setUser(JSON.parse(cached)); // instant UI restore
      }

      const fresh = await getUserById(Number(id));

      if (!fresh) {
        logout();
        return;
      }

      setSession(mapUser(fresh)); // update fresh data
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
     LOGIN (WITH KYC LOGIC)
  ============================= */
  const login = useCallback(async (data) => {
    try {
      const email = data.email.trim().toLowerCase();

      const users = await getUserByEmail(email);
      const found = users?.[0];

      if (!found) {
        return { success: false, message: "Invalid credentials" };
      }

      const match = await comparePassword(data.password, found.password);

      if (!match) {
        return { success: false, message: "Invalid credentials" };
      }

      const mapped = mapUser(found);
      setSession(mapped);

      return {
        success: true,
        user: mapped,
        kycStatus: mapped.kyc?.status,
      };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Login failed" };
    }
  }, []);

  /* =============================
     REGISTER
  ============================= */
  const createProfile = useCallback(async (data) => {
    try {
      const email = data.email.trim().toLowerCase();

      const users = await getUserByEmail(email);

      if (users.length > 0) {
        return { success: false, message: "Email already exists" };
      }

      const hashed = await hashPassword(data.password);

      await createUser({
        name: data.name.trim(),
        email,
        password: hashed,
        role: "customer",
        kyc: { status: null },
        createdAt: new Date().toISOString(),
      });

      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: "Registration failed" };
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const id = localStorage.getItem("userId");
      if (!id) return null;

      const res = await api.get(`/users/${id}`);

      if (res?.data) {
        const mapped = mapUser(res.data);
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
