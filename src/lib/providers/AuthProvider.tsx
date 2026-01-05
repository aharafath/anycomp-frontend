"use client";

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  AuthUser,
  useLazyGetCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from "../services/authApiSlice";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  hasRole: (roleName: string) => boolean;
  isAdmin: () => boolean;
  isUser: () => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchCurrentUser] = useLazyGetCurrentUserQuery();
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();
  const router = useRouter();

  const fetchMe = useCallback(async () => {
    setLoading(true);
    try {
      const { user: currentUser } = await fetchCurrentUser().unwrap();
      setUser(currentUser || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [fetchCurrentUser]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (email: string, password: string) => {
    try {
      const { user: loggedInUser } = await loginMutation({
        email,
        password,
      }).unwrap();
      setUser(loggedInUser ?? null);
      toast.success("Login successful! Welcome back.");
      return loggedInUser ?? null;
    } catch (error: any) {
      const message =
        error?.data?.message || error?.message || "Login failed. Please try again.";
      toast.error(message);
      return null;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await registerMutation({ name, email, password }).unwrap();
      toast.success("Account created successfully!");
      const loggedInUser = await login(email, password);
      return loggedInUser;
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Registration failed. Please try again later.";
      toast.error(message);
      return null;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.info(
        error?.data?.message || error?.message || "Logged out"
      );
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refresh: fetchMe,
      hasRole: (roleName: string) => user?.role?.name === roleName,
      isAdmin: () =>
        user?.role?.name === "Admin" || user?.role?.name === "Super Admin",
      isUser: () => user?.role?.name === "User",
    }),
    [user, loading, fetchMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
