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
  Chip,
} from "@mui/material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import Topbar from "@/components/dashboard/globals/Topbar";
import Breadcrumb from "@/components/dashboard/globals/Breadcrumb";
import Title from "@/components/dashboard/globals/Title";
import {
  PlatformFee,
  TierName,
  useCreatePlatformFeeMutation,
  useDeletePlatformFeeMutation,
  useGetAllPlatformFeesQuery,
  useUpdatePlatformFeeMutation,
} from "@/lib/services/platformFeeApiSlice";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/dashboard/globals/ConfirmModal";
import PlatformFeeFormDialog from "@/components/dashboard/platformFees/PlatformFeeFormDialog";

type FormState = {
  tier_name: TierName;
  min_value: number | "";
  max_value: number | "";
  platform_fee_percentage: number | "";
};

const emptyForm: FormState = {
  tier_name: "BASIC",
  min_value: "",
  max_value: "",
  platform_fee_percentage: "",
};

const PlatformFeesPage = () => {
  const {
    data: fees = [],
    isLoading,
    isFetching,
  } = useGetAllPlatformFeesQuery();
  const [createPlatformFee, { isLoading: creating }] =
    useCreatePlatformFeeMutation();
  const [updatePlatformFee, { isLoading: updating }] =
    useUpdatePlatformFeeMutation();
  const [deletePlatformFee, { isLoading: deleting }] =
    useDeletePlatformFeeMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PlatformFee | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const busy = isLoading || isFetching || creating || updating || deleting;

  const sortedFees = useMemo(
    () =>
      [...fees].sort(
        (a, b) =>
          Number(a.min_value ?? 0) - Number(b.min_value ?? 0) ||
          a.tier_name.localeCompare(b.tier_name)
      ),
    [fees]
  );

  const openDialog = (fee?: PlatformFee) => {
    if (fee) {
      setEditing(fee);
      setForm({
        tier_name: fee.tier_name,
        min_value: fee.min_value,
        max_value: fee.max_value,
        platform_fee_percentage: fee.platform_fee_percentage,
      });
    } else {
      setEditing(null);
      setForm(emptyForm);
    }
    setDialogOpen(true);
  };

  const handleClose = () => {
    if (busy) return;
    setDialogOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleChange = (field: keyof FormState, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        field === "tier_name"
          ? (value as TierName)
          : value === ""
          ? ""
          : Number(value),
    }));
  };

  const handleSave = async () => {
    if (
      form.min_value === "" ||
      form.max_value === "" ||
      form.platform_fee_percentage === ""
    ) {
      toast.error("Please complete all fields");
      return;
    }
    if (Number(form.min_value) > Number(form.max_value)) {
      toast.error("Min value cannot exceed max value");
      return;
    }
    const payload = {
      tier_name: form.tier_name,
      min_value: Number(form.min_value),
      max_value: Number(form.max_value),
      platform_fee_percentage: Number(form.platform_fee_percentage),
    };
    try {
      if (editing) {
        await updatePlatformFee({
          id: editing.id,
          data: payload,
        }).unwrap();
        toast.success("Platform fee updated");
      } else {
        await createPlatformFee(payload).unwrap();
        toast.success("Platform fee created");
      }
      handleClose();
    } catch (err) {
      toast.error(
        (err as { data?: { message?: string } }).data?.message ||
          "Failed to save platform fee"
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deletePlatformFee(deletingId).unwrap();
      toast.success("Platform fee deleted");
      setConfirmOpen(false);
      setDeletingId(null);
    } catch {
      toast.error("Failed to delete platform fee");
    }
  };

  return (
    <main className="flex-1">
      <Topbar />
      <Breadcrumb title="Platform Fees" />
      <div className="bg-white p-10 min-h-[calc(100vh-120px)]">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <Title
            title="Platform Fees"
            description="Manage pricing tiers and fee percentages"
          />
          <Button
            variant="contained"
            startIcon={<AddCircleOutline />}
            className="bg-secondary hover:bg-[#061133] normal-case px-6 py-2 rounded-md font-bold shadow-none"
            onClick={() => openDialog()}
            disabled={busy}
          >
            Add Fee Tier
          </Button>
        </div>

        <div className="bg-white overflow-hidden ">
          <Table sx={{ minWidth: 800 }}>
            <TableHead className="border-b border-gray-200">
              <TableRow>
                <TableCell className="text-xs font-bold text-gray-500">
                  Tier
                </TableCell>
                <TableCell className="text-xs font-bold text-gray-500">
                  Range (MYR)
                </TableCell>
                <TableCell className="text-xs font-bold text-gray-500">
                  Fee %
                </TableCell>
                <TableCell className="text-xs font-bold text-gray-500">
                  Updated
                </TableCell>
                <TableCell className="text-xs font-bold text-gray-500">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedFees.map((fee) => (
                <TableRow key={fee.id} hover>
                  <TableCell>
                    <Chip
                      label={fee.tier_name}
                      className={` font-semibold flex w-24 rounded-sm${
                        fee.tier_name === "BASIC"
                          ? "bg-red-100 text-red-700"
                          : fee.tier_name === "STANDARD"
                          ? "bg-blue-100 text-blue-700 "
                          : fee.tier_name === "PREMIUM"
                          ? "bg-yellow-100 text-yellow-800 "
                          : "bg-primary/10 text-primary"
                      }`}
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-gray-800">
                    {Number(fee.min_value).toLocaleString()} –{" "}
                    {Number(fee.max_value).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-semibold text-secondary">
                    {Number(fee.platform_fee_percentage).toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {fee.updated_at
                      ? new Date(fee.updated_at).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <IconButton
                        size="small"
                        onClick={() => openDialog(fee)}
                        className="text-primary"
                      >
                        <EditOutlined fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setDeletingId(fee.id);
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
              {!sortedFees.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    No platform fees configured yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <PlatformFeeFormDialog
          open={dialogOpen}
          busy={busy}
          editing={editing}
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
          title="Delete platform fee"
          description="Are you sure you want to delete this platform fee? This action cannot be undone."
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

export default PlatformFeesPage;
