"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import Image from "next/image";
import { toast } from "react-toastify";

type FormState = {
  title: string;
  description: string;
  file?: File | null;
  file_preview?: string | null;
};

interface Props {
  open: boolean;
  busy?: boolean;
  editing?: boolean;
  form: FormState;
  onClose: () => void;
  onChange: (field: keyof FormState, value: any) => void;
  onSave: () => void;
}

const ServiceOfferingFormDialog = ({
  open,
  busy,
  editing,
  form,
  onClose,
  onChange,
  onSave,
}: Props) => {
  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File exceeds 10MB limit");
      return;
    }
    const preview = URL.createObjectURL(file);
    if (form.file_preview?.startsWith("blob:")) {
      URL.revokeObjectURL(form.file_preview);
    }
    onChange("file", file);
    onChange("file_preview", preview);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="font-bold text-primary">
        {editing ? "Edit Service Offering" : "Add Service Offering"}
      </DialogTitle>

      <DialogContent className="space-y-4 pt-2">
        <TextField
          label="Title"
          size="small"
          fullWidth
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
        />

        <TextField
          label="Description"
          size="small"
          fullWidth
          multiline
          minRows={3}
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
        />

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-600">
            Service Image
          </label>

          <div
            className="border-2 border-dashed border-gray-200 p-5 rounded-lg flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handleFileSelect(file);
              };
              input.click();
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) handleFileSelect(file);
            }}
          >
            <p className="text-xs text-primary font-semibold">
              Browse or drag a file to upload
            </p>
            <p className="text-[11px] text-gray-500">
              JPG, PNG, WEBP (max 10MB)
            </p>
          </div>

          {form.file_preview && (
            <div className="flex items-center gap-3 bg-white shadow-sm p-2 rounded-md mt-2">
              <Image
                src={form.file_preview}
                alt="Preview"
                width={48}
                height={48}
                className="rounded object-cover"
              />
              <div className="text-xs text-gray-600">
                <p className="font-semibold">
                  {form.file?.name || "Existing image"}
                </p>
                {form.file && (
                  <p>{(form.file.size / (1024 * 1024)).toFixed(1)} MB</p>
                )}
              </div>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  if (form.file_preview?.startsWith("blob:")) {
                    URL.revokeObjectURL(form.file_preview);
                  }
                  onChange("file", null);
                  onChange("file_preview", null);
                }}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      </DialogContent>

      <DialogActions className="p-4">
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={busy}
          className="normal-case"
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={busy}
          className="bg-secondary hover:bg-[#061133] normal-case"
        >
          {editing ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceOfferingFormDialog;
