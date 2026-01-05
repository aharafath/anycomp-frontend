"use client";

import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;

  title?: string;
  description?: React.ReactNode;

  confirmText?: string;
  cancelText?: string;

  onConfirm: () => void | Promise<void>;
  loading?: boolean;

  /** UI variants */
  colorVariant?: "danger" | "primary";
  width?: number;

  /** Optional: aria ids override */
  ariaTitleId?: string;
};

const colors = {
  danger: {
    titleClass: "text-secondary",
    confirmClass: "bg-secondary hover:bg-primary text-white",
  },
  primary: {
    titleClass: "text-primary",
    confirmClass: "bg-primary hover:bg-secondary text-white",
  },
};

export default function ConfirmModal({
  open,
  onClose,
  title = "Confirm action",
  description = "Are you sure? This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  loading = false,
  colorVariant = "danger",
  width = 520,
  ariaTitleId = "confirm-modal-title",
}: ConfirmModalProps) {
  const theme = colors[colorVariant];

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby={ariaTitleId}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          width,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 24,
          p: 0,
          outline: "none",
          overflow: "hidden",
        }}
      >
        <div className="p-6 flex flex-col items-start">
          <Typography
            id={ariaTitleId}
            variant="h6"
            className={`font-bold mb-2 ${theme.titleClass}`}
          >
            {title}
          </Typography>

          <Typography className="text-primary text-sm">
            {description}
          </Typography>

          <div className="flex justify-end gap-3 w-full mt-6">
            <Button
              onClick={onClose}
              variant="outlined"
              disabled={loading}
              className="border-gray-300 text-primary font-bold capitalize px-6 py-2 rounded-md hover:bg-gray-50"
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              {cancelText}
            </Button>

            <Button
              onClick={onConfirm}
              variant="contained"
              disabled={loading}
              className={`${theme.confirmClass} font-bold capitalize px-6 py-2 rounded-md shadow-none disabled:opacity-60`}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              {loading ? "Processing..." : confirmText}
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
