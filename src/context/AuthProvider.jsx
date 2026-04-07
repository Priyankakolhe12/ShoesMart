import { AuthContext } from "./AuthContext";
import { useState, useEffect } from "react";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { getUserByEmail, getUserById, createUser } from "../api/userApi";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // restore session
  const me = async () => {
    try {
      const id = sessionStorage.getItem("userId");
      if (!id) return setLoading(false);

      const found = await getUserById(id);

      if (!found) return logout();

      setUser({
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.roleValue,
        kycStatus: found.kycStatus,
      });

      setAuthenticated(true);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    me();
  }, []);

  //  LOGIN
  const login = async (data) => {
    const users = await getUserByEmail(data.email);
    const found = users[0];

    if (!found) return { success: false, message: "Invalid credentials" };

    const match = await comparePassword(data.password, found.password);

    if (!match) return { success: false, message: "Invalid credentials" };

    const safeUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.roleValue,
      kycStatus: found.kycStatus,
    };

    setUser(safeUser);
    setAuthenticated(true);
    sessionStorage.setItem("userId", found.id);

    return { success: true, user: safeUser };
  };

  //  REGISTER
  const createProfile = async (data) => {
    const users = await getUserByEmail(data.email);

    if (users.length > 0) {
      return { success: false, message: "Email already exists" };
    }

    const hashed = await hashPassword(data.password);

    await createUser({
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashed,
      roleValue: "customer",
      kycStatus: null,
    });

    return { success: true };
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    setAuthenticated(false);
    sessionStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        createProfile,
        authenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
