"use client";

import { useAuth } from "@/lib/providers/AuthProvider";
import { EmailOutlined, NotificationsNoneOutlined } from "@mui/icons-material";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

const Topbar = () => {
  const { logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
  };

  return (
    <section className="p-4">
      <div className="bg-white w-full p-4  flex justify-end shadow-sm">
        <div className="flex items-center gap-1">
          <button className="p-0 cursor-pointer text-primary">
            <EmailOutlined />
          </button>
          <button className="p-0 cursor-pointer text-primary relative">
            <NotificationsNoneOutlined />
            <div>
              <span className="absolute text-[8px] text-white -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white">
                4
              </span>
            </div>
          </button>
          <button
            onClick={handleAvatarClick}
            className="p-0 cursor-pointer text-primary"
          >
            <Avatar src="/images/profile.png" sx={{ width: 30, height: 30 }} />
          </button>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={handleLogout}
              className="text-red-600 font-semibold"
            >
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
