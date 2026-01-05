"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/layouts/Sidebar";
import { useAuth } from "@/lib/providers/AuthProvider";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const roleName = user?.role?.name;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (roleName !== "Admin" && roleName !== "Super Admin") {
      router.replace("/user/specialists");
    }
  }, [loading, router, user]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen text-secondary">
        Checking access...
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="flex bg-[#F8F9FB] min-h-screen">
      <Sidebar />
      {children}
    </main>
  );
};

export default Layout;
