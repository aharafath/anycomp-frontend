"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import EditServiceDrawer from "@/components/dashboard/specialists/EditServiceDrawer";
import ServicePreview from "@/components/dashboard/specialists/ServicePreview";
import { useGetSpecialistBySlugQuery } from "@/lib/services/specialistApiSlice";

export default function ServicePage() {
  const params = useParams();
  const slugParam = params?.services as string;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerKey, setDrawerKey] = useState(0);

  const { data: specialist } = useGetSpecialistBySlugQuery(slugParam, {
    skip: false,
  });

  return (
    <div className="bg-white min-h-screen">
      <ServicePreview
        onEditOpen={() => {
          setDrawerKey((k) => k + 1);
          setDrawerOpen(true);
        }}
        specialist={specialist || null}
      />

      <EditServiceDrawer
        key={`${specialist?.id ?? "edit"}-${drawerKey}`}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        specialist={specialist || null}
        mode="edit"
      />
    </div>
  );
}
