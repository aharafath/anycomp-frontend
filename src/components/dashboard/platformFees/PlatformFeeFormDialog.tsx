"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import { TierName, PlatformFee } from "@/lib/services/platformFeeApiSlice";

export type PlatformFeeFormState = {
  tier_name: TierName;
  min_value: number | "";
  max_value: number | "";
  platform_fee_percentage: number | "";
};

const TIER_OPTIONS: TierName[] = ["BASIC", "STANDARD", "PREMIUM"];

interface Props {
  open: boolean;
  busy?: boolean;
  editing?: PlatformFee | null;
  form: PlatformFeeFormState;
  onClose: () => void;
  onChange: (field: keyof PlatformFeeFormState, value: string | number) => void;
  onSave: () => void;
}

const PlatformFeeFormDialog = ({
  open,
  busy,
  editing,
  form,
  onClose,
  onChange,
  onSave,
}: Props) => {
  const handleSubmit = () => {
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

    onSave();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="font-bold text-primary">
        {editing ? "Edit Platform Fee" : "Add Platform Fee"}
      </DialogTitle>

      <DialogContent className="space-y-4 pt-2">
        <TextField
          select
          fullWidth
          size="small"
          label="Tier"
          value={form.tier_name}
          onChange={(e) => onChange("tier_name", e.target.value)}
        >
          {TIER_OPTIONS.map((tier) => (
            <MenuItem key={tier} value={tier}>
              {tier}
            </MenuItem>
          ))}
        </TextField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextField
            label="Min Value"
            type="number"
            size="small"
            fullWidth
            value={form.min_value}
            onChange={(e) => onChange("min_value", e.target.value)}
          />
          <TextField
            label="Max Value"
            type="number"
            size="small"
            fullWidth
            value={form.max_value}
            onChange={(e) => onChange("max_value", e.target.value)}
          />
        </div>

        <TextField
          label="Platform Fee (%)"
          type="number"
          size="small"
          fullWidth
          value={form.platform_fee_percentage}
          onChange={(e) => onChange("platform_fee_percentage", e.target.value)}
          inputProps={{ step: "0.01" }}
        />
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
          onClick={handleSubmit}
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

export default PlatformFeeFormDialog;
