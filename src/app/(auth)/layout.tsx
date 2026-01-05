"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/providers/AuthProvider";

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) {
      const roleName = user.role?.name;
      if (roleName === "Admin" || roleName === "Super Admin") {
        router.replace("/admin/specialists");
      } else {
        router.replace("/user/specialists");
      }
    }
  }, [loading, router, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-secondary">
        Checking your session...
      </div>
    );
  }

  if (user) return null;

  return <>{children}</>;
};

export default AuthLayout;
