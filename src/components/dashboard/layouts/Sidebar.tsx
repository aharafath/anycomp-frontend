"use client";

import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import { HelpOutline, SettingsOutlined } from "@mui/icons-material";

import UserGroup from "@/components/svg/icons/UserGroup";
import Clipboard from "@/components/svg/icons/Clipboard";
import EditIcon from "@/components/svg/icons/EditIcon";
import Mailicon from "@/components/svg/icons/Mailicon";
import Note from "@/components/svg/icons/Note";
import Label from "@/components/svg/icons/Label";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DollarCoin from "@/components/svg/icons/DollarCoin";
import ServiceStore from "@/components/svg/icons/ServiceStore";

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  link: string;
}

const INITIAL_MENU_ITEMS: MenuItem[] = [
  { text: "Specialists", icon: <Label />, link: "/specialists" },
  { text: "Clients", icon: <UserGroup />, link: "#" },
  { text: "Service Orders", icon: <Clipboard />, link: "#" },
  { text: "eSignature", icon: <EditIcon />, link: "#" },
  { text: "Messages", icon: <Mailicon />, link: "#" },
  { text: "Invoices & Receipts", icon: <Note />, link: "#" },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const basePath = pathname.startsWith("/admin")
    ? "/admin"
    : pathname.startsWith("/user")
    ? "/user"
    : "";

  const menuItems: MenuItem[] =
    basePath === "/admin"
      ? [
          { text: "Specialists", icon: <Label />, link: "/admin/specialists" },
          {
            text: "Platform Fees",
            icon: <DollarCoin />,
            link: "/admin/platform-fees",
          },
          {
            text: "Service Offerings",
            icon: <ServiceStore />,
            link: "/admin/service-offerings",
          },
          ...INITIAL_MENU_ITEMS.slice(1).map((item) => ({
            ...item,
            link:
              item.link === "/specialists" ? "/admin/specialists" : item.link,
          })),
        ]
      : INITIAL_MENU_ITEMS.map((item, index) => {
          const computedLink =
            index === 0
              ? `${basePath}/specialists`
              : item.link === "/specialists"
              ? `${basePath}${item.link}`
              : item.link;

          if (index === 0 && pathname.startsWith(`${basePath}/specialists`)) {
            return {
              ...item,
              text: "Services",
              icon: <Label />,
              link: pathname,
            };
          }
          return { ...item, link: computedLink };
        });

  return (
    <Box className="w-72 h-screen bg-white flex flex-col p-5 sticky top-0">
      <Typography
        variant="h6"
        className="font-bold mb-6 px-4 text-xl text-primary"
      >
        Profile
      </Typography>

      <div className="flex items-center gap-3 mb-10 px-4">
        <Avatar src="/images/profile.png" sx={{ width: 40, height: 40 }} />
        <div>
          <Typography className="font-medium text-nd leading-tight">
            Gwen Lam
          </Typography>
          <Typography className="text-xs text-primary font-semibold">
            ST Comp Holdings Sdn Bhd
          </Typography>
        </div>
      </div>

      <nav className="grow">
        <Typography className="text-gray-400 text-[10px] font-bold mb-3 uppercase px-4 tracking-wider">
          Dashboard
        </Typography>
        <List disablePadding>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              component={Link}
              href={item.link}
              className={`rounded-lg mb-1 cursor-pointer transition-all ${
                pathname === item.link || pathname.startsWith(`${item.link}/`)
                  ? "bg-secondary text-white shadow-md"
                  : "text-primary hover:bg-gray-100"
              }`}
            >
              <ListItemIcon
                className={`min-w-10 ${
                  item.link === pathname ? "text-white" : "text-gray-400"
                }`}
              >
                {React.cloneElement(
                  item.icon as React.ReactElement<{ fill: string }>,
                  {
                    fill: item.link === pathname ? "#fff" : "#454545",
                  }
                )}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "14px",
                  fontWeight: item.link === pathname ? 600 : 500,
                }}
              />
            </ListItem>
          ))}
        </List>
      </nav>

      <List disablePadding className="mt-auto  pt-4">
        <ListItem
          component="div"
          className="text-primary cursor-pointer hover:bg-gray-100 rounded-lg"
        >
          <ListItemIcon className="min-w-10">
            <HelpOutline fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Help"
            primaryTypographyProps={{ fontSize: "14px" }}
          />
        </ListItem>
        <ListItem
          component="div"
          className="text-primary cursor-pointer hover:bg-gray-100 rounded-lg mt-1"
        >
          <ListItemIcon className="min-w-10">
            <SettingsOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Settings"
            primaryTypographyProps={{ fontSize: "14px" }}
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
