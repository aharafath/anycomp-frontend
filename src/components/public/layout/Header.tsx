"use client";

import { useAuth } from "@/lib/providers/AuthProvider";
import {
  KeyboardArrowDown,
  NotificationsNoneOutlined,
  EmailOutlined,
} from "@mui/icons-material";
import { Avatar, Menu, MenuItem } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { IoSearchOutline } from "react-icons/io5";

const Header = () => {
  const { user, loading, isAdmin, logout } = useAuth();

  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (loading) return null;

  return (
    <header className=" border-b border-gray-100  py-4 ">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8">
        <div className="flex items-center space-x-10">
          <h1 className="font-black text-xl tracking-tighter uppercase">
            AnyComp
          </h1>
          <nav className="hidden md:flex space-x-6 text-xs font-medium">
            <a href="#" className="hover:text-secondary">
              Register a company
            </a>
            <a href="#" className="hover:text-secondary">
              Appoint a Company Secretary
            </a>
            <div className="flex items-center cursor-pointer hover:text-secondary">
              Company Secretarial Services{" "}
              <KeyboardArrowDown fontSize="small" />
            </div>
            <a href="#" className="hover:text-secondary">
              How Anycomp Works
            </a>
          </nav>
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative flex items-center border border-gray-300 rounded-sm bg-gray-50 ">
            <input
              type="text"
              placeholder="Search for any services..."
              className="bg-transparent outline-none text-xs w-48 px-2 "
            />
            <button className="bg-secondary p-1 text-white px-2 ">
              <IoSearchOutline className="w-4 h-5" />
            </button>
          </div>

          {!user ? (
            <div className="flex items-center gap-4 text-sm font-semibold">
              <Link
                href="/login"
                className="hover:text-secondary text-gray-600"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-secondary text-white px-4 py-1.5 rounded-sm hover:opacity-90"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <button className="p-0 cursor-pointer text-primary">
                <EmailOutlined />
              </button>
              <button className="p-0 cursor-pointer text-primary relative">
                <NotificationsNoneOutlined />
                <div>
                  <span className="absolute text-[8px] text-white top-1 right-0.5 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                </div>
              </button>

              <button className="cursor-pointer" onClick={handleAvatarClick}>
                <Avatar
                  src="/images/profile.png"
                  sx={{ width: 30, height: 30 }}
                />
              </button>

              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem
                  onClick={() => {
                    router.push("/user/specialists");
                    handleClose();
                  }}
                >
                  Dashboard
                </MenuItem>

                {isAdmin() && (
                  <MenuItem
                    onClick={() => {
                      router.push("/admin/specialists");
                      handleClose();
                    }}
                  >
                    Admin Dashboard
                  </MenuItem>
                )}

                <MenuItem
                  onClick={async () => {
                    handleClose();
                    await logout();
                  }}
                  className="text-red-500"
                >
                  Logout
                </MenuItem>
              </Menu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
