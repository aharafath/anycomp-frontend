"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  TextField,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import {
  AddCircleOutlineOutlined,
  DeleteOutline,
  EditOutlined,
} from "@mui/icons-material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useDeleteSpecialistMutation,
  useGetAllSpecialistsQuery,
  useApproveSpecialistMutation,
  useRejectSpecialistMutation,
} from "@/lib/services/specialistApiSlice";
import { toast } from "react-toastify";
import ConfirmModal from "../globals/ConfirmModal";

interface Props {
  status?: string;
}

const ServiceTable: React.FC<Props> = ({ status }) => {
  const router = useRouter();
  const pathname = usePathname();
  const basePath = pathname.startsWith("/admin")
    ? "/admin"
    : pathname.startsWith("/user")
    ? "/user"
    : "";

  // States
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Fetch data
  const { data, isLoading, isFetching } = useGetAllSpecialistsQuery({
    status,
    search,
    page,
    limit,
  });
  const [deleteSpecialist, { isLoading: deleting }] =
    useDeleteSpecialistMutation();
  const [approveSpecialist] = useApproveSpecialistMutation();
  const [rejectSpecialist] = useRejectSpecialistMutation();

  // Admin routes are under /admin, user routes under /user
  const isAdmin = basePath === "/admin";

  const specialists = data?.data ?? [];
  const meta = data?.meta;

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(specialists.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleMenuOpen = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    setAnchorEl(e.currentTarget);
    setSelectedRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const handleEdit = () => {
    if (selectedRowId) {
      const target = specialists.find((s) => s.id === selectedRowId);
      const slugOrId = target?.slug || selectedRowId;
      router.push(`${basePath}/specialists/${slugOrId}`);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!selectedRowId) return;
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRowId) return;
    try {
      await deleteSpecialist(selectedRowId).unwrap();
      setSelectedIds((prev) => prev.filter((id) => id !== selectedRowId));
      toast.success("Service deleted successfully");
    } catch {
      toast.error("Failed to delete service");
    } finally {
      setConfirmOpen(false);
      handleMenuClose();
    }
  };

  const getApprovalColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-[#18C96466] text-[#1AC623]";
      case "PENDING":
        return "bg-[#61E7DA66] text-[#00AC95]";
      case "REJECTED":
        return "bg-[#C0030666] text-[#C00306]";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  const handleApprove = async () => {
    if (!selectedRowId) return;
    try {
      await approveSpecialist(selectedRowId).unwrap();
      toast.success("Specialist approved successfully");
      handleMenuClose();
    } catch {
      toast.error("Failed to approve specialist");
    }
  };

  const handleReject = async () => {
    if (!selectedRowId) return;
    try {
      await rejectSpecialist(selectedRowId).unwrap();
      toast.success("Specialist rejected successfully");
      handleMenuClose();
    } catch {
      toast.error("Failed to reject specialist");
    }
  };

  // Pagination logic
  const getPagination = () => {
    if (!meta) return [];
    const pages: (number | string)[] = [];
    if (meta.totalPages <= 5) {
      for (let i = 1; i <= meta.totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(meta.totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }
      if (page < meta.totalPages - 2) pages.push("...");
      pages.push(meta.totalPages);
    }
    return pages;
  };

  return (
    <>
      {/* Action Bar */}
      <div className="flex justify-between items-center mb-8">
        <TextField
          placeholder="Search Services..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#F1F1F1] rounded-md w-80"
          sx={{ "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
        />
        <div className="flex gap-3">
          <Link href={`${basePath}/specialists/create`}>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineOutlined />}
              className="bg-secondary hover:bg-[#061133] normal-case px-6 py-2 rounded-md font-bold shadow-none"
            >
              Create
            </Button>
          </Link>
          <Button
            variant="contained"
            startIcon={<FileDownloadOutlinedIcon />}
            className="bg-primary hover:bg-secondary normal-case px-6 py-2 rounded-md font-bold shadow-none"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white overflow-hidden ">
        <Table sx={{ minWidth: 800 }}>
          <TableHead className="border-b border-gray-200">
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  size="small"
                  checked={
                    specialists.length > 0 &&
                    selectedIds.length === specialists.length
                  }
                  indeterminate={
                    selectedIds.length > 0 &&
                    selectedIds.length < specialists.length
                  }
                  onChange={handleSelectAll}
                  sx={{
                    color: "#E5E7EB",
                    "&.Mui-checked, &.MuiCheckbox-indeterminate": {
                      color: "#0A1D56",
                    },
                  }}
                />
              </TableCell>
              <TableCell className="text-[#999999] font-bold text-[10px] uppercase tracking-widest border-none">
                Service
              </TableCell>
              <TableCell className="text-[#999999] font-bold text-[10px] uppercase tracking-widest border-none text-center">
                Price
              </TableCell>
              <TableCell className="text-[#999999] font-bold text-[10px] uppercase tracking-widest border-none text-center">
                Purchases
              </TableCell>
              <TableCell className="text-[#999999] font-bold text-[10px] uppercase tracking-widest border-none text-center">
                Duration
              </TableCell>
              <TableCell className="text-[#999999] font-bold text-[10px] uppercase tracking-widest border-none">
                Approval Status
              </TableCell>
              <TableCell className="text-[#999999] font-bold text-[10px] uppercase tracking-widest border-none">
                Publish Status
              </TableCell>
              <TableCell className="text-[#999999] font-bold text-[10px] uppercase tracking-widest border-none">
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading || isFetching ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx} className="border-b border-gray-50">
                  <TableCell padding="checkbox">
                    <div className="h-4 w-4 bg-gray-100 rounded" />
                  </TableCell>
                  {[120, 80, 60, 60, 90, 90, 40].map((width, i) => (
                    <TableCell key={i}>
                      <div
                        className="h-3 bg-gray-100 rounded"
                        style={{ width }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : specialists.length > 0 ? (
              specialists.map((row) => {
                const isSelected = selectedIds.includes(row.id);
                return (
                  <TableRow
                    key={row.id}
                    selected={isSelected}
                    className={`transition-colors border-b border-gray-50 last:border-none ${
                      isSelected ? "bg-blue-50/40" : "hover:bg-gray-50/50"
                    }`}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={isSelected}
                        onChange={() => handleSelectRow(row.id)}
                        sx={{
                          color: "#E5E7EB",
                          "&.Mui-checked": { color: "#0A1D56" },
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-bold text-primary text-[13px]">
                      {row.title}
                    </TableCell>
                    <TableCell className="text-center font-bold text-primary text-[13px]">
                      RM {Number(row.base_price).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center font-bold text-primary text-[13px]">
                      0
                    </TableCell>
                    <TableCell className="text-center font-bold text-primary text-[13px]">
                      {row.duration_days}{" "}
                      {row.duration_days > 1 ? "Days" : "Day"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-sm text-[10px] font-bold flex w-24 justify-center ${getApprovalColor(
                          row.verification_status
                        )}`}
                      >
                        {row.verification_status === "APPROVED"
                          ? "Approved"
                          : row.verification_status === "PENDING"
                          ? "Under Review"
                          : row.verification_status === "REJECTED"
                          ? "Rejected"
                          : "Pending"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={!row.is_draft ? "Published" : "Not Published"}
                        size="small"
                        className={`font-bold text-[10px] rounded-sm h-6 px-1 text-white flex w-24 justify-center ${
                          !row.is_draft ? "bg-[#18C964]" : "bg-[#C00306]"
                        }`}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, row.id)}
                        size="small"
                        className="text-gray-400 hover:text-primary"
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-24 text-gray-400 font-medium"
                >
                  No services found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleMenuClose}
        PaperProps={{ sx: { minWidth: 200, mt: 1 } }}
      >
        <MenuItem
          onClick={handleEdit}
          sx={{ fontSize: "13px", fontWeight: 600 }}
        >
          <EditOutlined sx={{ fontSize: 18, mr: 1 }} /> Edit
        </MenuItem>
        {isAdmin && [
          <MenuItem
            key="approve"
            onClick={handleApprove}
            sx={{ fontSize: "13px", fontWeight: 600, color: "green" }}
          >
            <AddCircleOutlineOutlined sx={{ fontSize: 18, mr: 1 }} /> Approve
          </MenuItem>,
          <MenuItem
            key="reject"
            onClick={handleReject}
            sx={{ fontSize: "13px", fontWeight: 600, color: "red" }}
          >
            <DeleteOutline sx={{ fontSize: 18, mr: 1 }} /> Reject
          </MenuItem>,
        ]}
        <MenuItem
          onClick={handleDelete}
          sx={{ fontSize: "13px", fontWeight: 600 }}
        >
          <DeleteOutline sx={{ fontSize: 18, mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete service"
        description={
          <>
            Are you sure you want to delete this service? This action cannot be
            undone.
          </>
        }
        confirmText={deleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        loading={deleting}
        onConfirm={confirmDelete}
        colorVariant="danger"
      />

      {/* Pagination */}
      {meta && (
        <div className="mt-12 flex justify-center items-center gap-3">
          <button
            onClick={() => page > 1 && setPage(page - 1)}
            disabled={page === 1}
            className=" cursor-pointer px-3 py-1 font-bold text-sm text-primary disabled:text-gray-300"
          >
            Previous
          </button>
          {getPagination().map((p, idx) =>
            p === "..." ? (
              <span key={idx} className="px-2 text-primary">
                ...
              </span>
            ) : (
              <button
                key={idx}
                onClick={() => setPage(p as number)}
                className={`cursor-pointer w-6 h-6 flex items-center justify-center rounded-full font-bold ${
                  p === page
                    ? "bg-[#0A1D56] text-white shadow"
                    : "text-primary hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            )
          )}
          <button
            onClick={() => page < meta.totalPages && setPage(page + 1)}
            disabled={page === meta.totalPages}
            className=" cursor-pointer px-3 py-1 font-bold text-sm text-primary disabled:text-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default ServiceTable;
