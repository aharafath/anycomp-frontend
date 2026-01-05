"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import EditServiceDrawer from "@/components/dashboard/specialists/EditServiceDrawer";
import ServicePreview from "@/components/dashboard/specialists/ServicePreview";

export default function CreateSpecialistPage() {
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleSaved = (slug: string) => {
    router.push(`/user/specialists/${slug}`);
  };

  const handleClose = () => {
    router.push(`/user/specialists`);
  };

  return (
    <div className="bg-white min-h-screen">
      <ServicePreview
        onEditOpen={() => {
          setDrawerOpen(true);
        }}
      />

      <EditServiceDrawer
        open={drawerOpen}
        onClose={handleClose}
        specialist={null}
        mode="create"
        onSaved={handleSaved}
      />
    </div>
  );
}
