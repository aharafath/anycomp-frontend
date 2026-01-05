"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/providers/AuthProvider";

import LeftImage from "@/components/auth/LeftImage";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const disabled = useMemo(
    () => !email || !password || loading,
    [email, password, loading]
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password);
      if (!user) return;

      const role = user?.role?.name;
      router.push(
        role === "Admin" || role === "Super Admin"
          ? "/admin/specialists"
          : "/user/specialists"
      );
    } catch (err: any) {
      toast.error(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT IMAGE SECTION */}
      <LeftImage />

      {/* RIGHT FORM SECTION */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white  shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-10">
          <h1 className="text-3xl font-bold text-gray-900">Login</h1>
          <p className="text-gray-500 mt-1">
            Register and manage your company with ease
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-3 focus:ring-2 focus:ring-[#0b3a82] outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-3 focus:ring-2 focus:ring-[#0b3a82] outline-none"
              />
            </div>

            <button
              disabled={disabled}
              className="w-full bg-[#0b3a82] text-white py-3 rounded-md font-semibold hover:bg-[#092f69] transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 flex justify-between text-sm">
            <p className="text-gray-600">
              No account?{" "}
              <Link
                href="/register"
                className="text-[#0b3a82] font-semibold hover:underline"
              >
                Register here
              </Link>
            </p>

            <Link href="#" className="text-[#0b3a82] hover:underline">
              Reset Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
