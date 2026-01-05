import React from "react";

import Header from "@/components/public/layout/Header";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* --- Navigation Bar --- */}
      <Header />

      {children}
    </div>
  );
};

export default Layout;
