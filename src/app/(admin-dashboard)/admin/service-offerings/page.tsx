"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import Topbar from "@/components/dashboard/globals/Topbar";
import Breadcrumb from "@/components/dashboard/globals/Breadcrumb";
import Title from "@/components/dashboard/globals/Title";
import {
  ServiceOfferingsMasterList,
  useCreateServiceOfferingMasterListMutation,
  useDeleteServiceOfferingMasterListMutation,
  useGetAllServiceOfferingsMasterListQuery,
  useUpdateServiceOfferingMasterListMutation,
} from "@/lib/services/serviceOfferingsMasterListApiSlice";
import { toast } from "react-toastify";
import Image from "next/image";
import ServiceOfferingFormDialog from "@/components/dashboard/serviceOfferings/ServiceOfferingFormDialog";
import ConfirmModal from "@/components/dashboard/globals/ConfirmModal";

type FormState = {
  title: string;
  description: string;
  file?: File | null;
  file_preview?: string | null;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  file: null,
  file_preview: null,
};

const ServiceOfferingsPage = () => {
  const {
    data: offerings = [],
    isLoading,
    isFetching,
  } = useGetAllServiceOfferingsMasterListQuery();
  const [createOffering, { isLoading: creating }] =
    useCreateServiceOfferingMasterListMutation();
  const [updateOffering, { isLoading: updating }] =
    useUpdateServiceOfferingMasterListMutation();
  const [deleteOffering, { isLoading: deleting }] =
    useDeleteServiceOfferingMasterListMutation();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceOfferingsMasterList | null>(
    null
  );
  const [form, setForm] = useState<FormState>(emptyForm);

  const busy = isLoading || isFetching || creating || updating || deleting;

  const sortedOfferings = useMemo(
    () =>
      [...offerings].sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
      ),
    [offerings]
  );

  const openDialog = (item?: ServiceOfferingsMasterList) => {
    if (item) {
      setEditing(item);
      setForm({
        title: item.title,
        description: item.description,
        file: null,
        file_preview: item.s3_key
          ? `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL || ""}${item.s3_key}`
          : null,
      });
    } else {
      setEditing(null);
      setForm(emptyForm);
    }
    setDialogOpen(true);
  };

  const handleClose = () => {
    if (busy) return;
    if (form.file_preview?.startsWith("blob:")) {
      URL.revokeObjectURL(form.file_preview);
    }
    setDialogOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleChange = (
    field: keyof FormState,
    value: string | File | null
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.title || !form.description) {
      toast.error("Title and description are required");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description);
      if (form.file) payload.append("file", form.file);

      if (editing) {
        await updateOffering({
          id: editing.id,
          data: payload,
        }).unwrap();
        toast.success("Service offering updated");
      } else {
        await createOffering(payload).unwrap();
        toast.success("Service offering created");
      }
      handleClose();
    } catch (err) {
      toast.error(
        (err as { data?: { message?: string } }).data?.message ||
          "Failed to save service offering"
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteOffering(deletingId).unwrap();
      toast.success("Service offering deleted");
      setConfirmOpen(false);
      setDeletingId(null);
    } catch {
      toast.error("Failed to delete service offering");
    }
  };

  return (
    <main className="flex-1">
      <Topbar />
      <Breadcrumb title="Service Offerings" />
      <div className="bg-white p-10 min-h-[calc(100vh-120px)]">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <Title
            title="Service Offerings"
            description="Manage the master list of services available to specialists"
          />
          <Button
            variant="contained"
            startIcon={<AddCircleOutline />}
            className="bg-secondary hover:bg-[#061133] normal-case px-6 py-2 rounded-md font-bold shadow-none"
            onClick={() => openDialog()}
            disabled={busy}
          >
            Add Offering
          </Button>
        </div>

        <div className="bg-white overflow-hidden ">
          <Table sx={{ minWidth: 800 }}>
            <TableHead className="border-b border-gray-200">
              <TableRow>
                <TableCell className="text-xs font-bold text-gray-500">
                  Icon
                </TableCell>
                <TableCell className="text-xs font-bold text-gray-500">
                  Title
                </TableCell>
                <TableCell className="text-xs font-bold text-gray-500">
                  Description
                </TableCell>
                <TableCell className="text-xs font-bold text-gray-500">
                  Bucket Name
                </TableCell>
                <TableCell className="text-xs font-bold text-gray-500">
                  S3 Key
                </TableCell>
                <TableCell className="text-xs font-bold text-gray-500">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedOfferings.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell className="font-semibold text-gray-800">
                    <Image
                      height={80}
                      width={80}
                      alt="Icon"
                      src={`${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/${item.s3_key}`}
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-gray-800">
                    {item.title}
                  </TableCell>
                  <TableCell className="text-gray-600 max-w-lg">
                    <span className="line-clamp-2">{item.description}</span>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {item.bucket_name || "-"}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {item.s3_key || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <IconButton
                        size="small"
                        onClick={() => openDialog(item)}
                        className="text-primary"
                      >
                        <EditOutlined fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setDeletingId(item.id);
                          setConfirmOpen(true);
                        }}
                        className="text-red-500"
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!sortedOfferings.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    No service offerings yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <ServiceOfferingFormDialog
          open={dialogOpen}
          busy={busy}
          editing={!!editing}
          form={form}
          onClose={handleClose}
          onChange={handleChange}
          onSave={handleSave}
        />
        <ConfirmModal
          open={confirmOpen}
          onClose={() => {
            if (busy) return;
            setConfirmOpen(false);
            setDeletingId(null);
          }}
          title="Delete service offering"
          description="Are you sure you want to delete this service offering? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          loading={deleting}
          onConfirm={handleDelete}
          colorVariant="danger"
        />
      </div>
    </main>
  );
};

export default ServiceOfferingsPage;
