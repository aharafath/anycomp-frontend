"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { useAuth } from "@/lib/providers/AuthProvider";
import LeftImage from "@/components/auth/LeftImage";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const disabled = useMemo(
    () =>
      !name || !email || !password || password !== confirmPassword || loading,
    [name, email, password, confirmPassword, loading]
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const user = await register(name, email, password);
      if (!user) return;

      toast.success("Account created!");
      const role = user?.role?.name;
      router.push(
        role === "Admin" || role === "Super Admin"
          ? "/admin/specialists"
          : "/user/specialists"
      );
    } catch (err: any) {
      toast.error(err?.message || "Registration failed");
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
          <h1 className="text-3xl font-bold text-gray-900">Register</h1>
          <p className="text-gray-500 mt-1">
            Register and manage your company with ease
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-3 focus:ring-2 focus:ring-[#0b3a82] outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
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
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-3 focus:ring-2 focus:ring-[#0b3a82] outline-none"
                minLength={8}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-3 focus:ring-2 focus:ring-[#0b3a82] outline-none"
                minLength={8}
              />
            </div>

            <button
              disabled={disabled}
              className="w-full bg-[#0b3a82] text-white py-3 rounded-md font-semibold hover:bg-[#092f69] transition disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 flex justify-between text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#0b3a82] font-semibold hover:underline"
              >
                Log in
              </Link>
            </p>

            <Link href="/login" className="text-[#0b3a82] hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
