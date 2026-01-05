"use client";
import React from "react";
import ServiceTable from "@/components/dashboard/specialists/ServiceTable";
import Topbar from "@/components/dashboard/globals/Topbar";
import Breadcrumb from "@/components/dashboard/globals/Breadcrumb";
import Title from "@/components/dashboard/globals/Title";
import TabsComponent from "@/components/dashboard/globals/TabsComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

// 1. Tab Items Configuration
const TAB_ITEMS = [
  { id: 0, label: "All Services", status: undefined },
  { id: 1, label: "Drafts", status: "DRAFT" },
  { id: 2, label: "Published", status: "PUBLISHED" },
];

const Dashboard: React.FC = () => {
  const currentTab = useSelector((state: RootState) => state.tabs.value);

  const currentStatus = TAB_ITEMS[currentTab].status;

  return (
    <main className="flex-1">
      <Topbar />
      <Breadcrumb title="Services" />
      {/* Main Content Area */}
      <div className="bg-white p-10 min-h-[calc(100vh-120px)] ">
        <Title
          title="Specialists"
          description="Create and publish your services for Client's & Companies"
        />
        <TabsComponent TAB_ITEMS={TAB_ITEMS} />

        {/* 3. Dynamic Table */}
        <ServiceTable status={currentStatus} />
      </div>
    </main>
  );
};

export default Dashboard;
