"use client";
import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  TextField,
  Button,
  InputAdornment,
  Chip,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

import { FaRegTrashAlt } from "react-icons/fa";
import { HiInformationCircle } from "react-icons/hi";
import { toast } from "react-toastify";
import { useGetAllServiceOfferingsMasterListQuery } from "@/lib/services/serviceOfferingsMasterListApiSlice";
import {
  Specialist,
  useCreateSpecialistMutation,
  useUpdateSpecialistMutation,
} from "@/lib/services/specialistApiSlice";

interface Props {
  open: boolean;
  onClose: () => void;
  specialist?: Specialist | null;
  mode?: "create" | "edit";
  onSaved?: (slug: string) => void;
}

interface UploadedFile {
  id?: string;
  file?: File;
  file_name: string;
  file_size: string;
  file_type: string;
  file_preview: string;
  isNew?: boolean;
}

const EditServiceDrawer: React.FC<Props> = ({
  open,
  onClose,
  specialist,
  mode = "create",
  onSaved,
}) => {
  const {
    data: masterListOfferings,
    isLoading: offeringsLoading,
    isError: offeringsError,
  } = useGetAllServiceOfferingsMasterListQuery();

  const [createSpecialist, { isLoading: creating }] =
    useCreateSpecialistMutation();
  const [updateSpecialist, { isLoading: updating }] =
    useUpdateSpecialistMutation();

  const [title, setTitle] = useState(() => specialist?.title || "");
  const [description, setDescription] = useState(
    () => specialist?.description || ""
  );
  const [price, setPrice] = useState<number>(
    () => Number(specialist?.base_price) || 0
  );
  const [duration, setDuration] = useState<number>(
    () => specialist?.duration_days || 1
  );
  const [selectedOfferings, setSelectedOfferings] = useState<string[]>(
    () =>
      specialist?.service_offerings
        ?.map((o) => o.service_offerings_master_list?.id)
        .filter(Boolean) || []
  );
  const [uploadedFiles, setUploadedFiles] = useState<{
    [key: number]: UploadedFile | null;
  }>(() => {
    const mapped: { [key: number]: UploadedFile } = {};
    (specialist?.media || []).forEach((item) => {
      const slot = (item.display_order ?? 0) + 1;
      mapped[slot] = {
        id: item.id,
        file_name: item.file_name || "",
        file_size:
          (Number(item.file_size) / (1024 * 1024)).toFixed(1) + " MB" || "",
        file_type: item.media_type || "IMG",
        file_preview: `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}${item.file_name}`,
      };
    });
    return mapped;
  });

  const removeFile = (slot: number) => {
    setUploadedFiles((prev) => {
      const updated = { ...prev };
      if (updated[slot]) {
        URL.revokeObjectURL(updated[slot]!.file_preview);
        updated[slot] = null;
      }
      return updated;
    });
  };
  const handleAddOffering = (event: SelectChangeEvent) => {
    const val = event.target.value;
    if (val && !selectedOfferings.includes(val)) {
      setSelectedOfferings([...selectedOfferings, val]);
    }
  };

  const removeOffering = (item: string) => {
    setSelectedOfferings(selectedOfferings.filter((i) => i !== item));
  };

  const handleFileStateUpdate = (
    num: number,
    fileData: File | UploadedFile
  ) => {
    const isNew = fileData instanceof File;
    const preview = isNew
      ? URL.createObjectURL(fileData)
      : (fileData as UploadedFile).file_preview;

    setUploadedFiles((prev) => ({
      ...prev,
      [num]: {
        id: isNew ? undefined : (fileData as UploadedFile).id,
        file: isNew ? fileData : undefined,
        isNew,
        file_name: isNew ? fileData.name : (fileData as UploadedFile).file_name,
        file_size: isNew
          ? (fileData.size / (1024 * 1024)).toFixed(1) + " MB"
          : (fileData as UploadedFile).file_size,
        file_type: isNew
          ? fileData.type?.split("/")[1]?.toUpperCase() || "IMG"
          : (fileData as UploadedFile).file_type,
        file_preview: preview,
      },
    }));
  };

  const handleDragFileUpload = async (
    num: number,
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      toast.error("File size exceeds 4MB limit");
      return;
    }

    handleFileStateUpdate(num, file);
  };

  const handleCreateSpecialist = async () => {
    if (!title || !description) {
      toast.error("Please fill title and description");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("base_price", String(price));
    formData.append("duration_days", String(duration));

    selectedOfferings.forEach((id) =>
      formData.append("service_offering_master_list_ids", id)
    );

    const file1 = uploadedFiles[1]?.file;
    const file2 = uploadedFiles[2]?.file;
    const file3 = uploadedFiles[3]?.file;

    if (file1) formData.append("file_1", file1);
    if (file2) formData.append("file_2", file2);
    if (file3) formData.append("file_3", file3);

    formData.append("media_type", "THUMBNAIL");

    try {
      if (mode === "edit" && specialist?.id) {
        await updateSpecialist({
          id: specialist.id,
          data: formData as any,
        }).unwrap();
        toast.success("Specialist updated successfully!");
        onClose();
      } else {
        const createdData = await createSpecialist(formData as any).unwrap();

        const slug = (createdData as { data?: { slug: string } })?.data?.slug;

        toast.success("Specialist created successfully!");
        if (slug) {
          onSaved?.(slug);
        }
      }
    } catch (err) {
      toast.error(
        (err as { data: { message: string } }).data?.message ||
          "Failed to save specialist"
      );
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 450 } }}
    >
      <div className="h-full flex flex-col p-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === "edit" ? "Edit Service" : "Create Service"}
          </h2>
          <IconButton
            onClick={onClose}
            size="small"
            className="border border-gray-200"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>

        <div className="grow space-y-8 overflow-y-auto px-2 custom-scrollbar">
          <div className="space-y-2">
            <label className="text-xs font-bold">Title</label>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter service title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold">Description</label>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Describe your service here"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              helperText={
                <span className="flex justify-end text-[10px] text-gray-400 mt-1">
                  0/500 words
                </span>
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold">
              Estimated Completion Time (Days)
            </label>
            <Select
              fullWidth
              size="small"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                (day) => (
                  <MenuItem key={day} value={day}>
                    {day} {day === 1 ? "day" : "days"}
                  </MenuItem>
                )
              )}
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold">Price</label>
            <TextField
              type="number"
              fullWidth
              size="small"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    className="m-0 mr-1 pr-2 border-r border-gray-300 font-bold"
                  >
                    <span className="text-xs flex items-center gap-1 text-black">
                      🇲🇾 MYR
                    </span>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold">Additional Offerings</label>

            <Select
              fullWidth
              size="small"
              displayEmpty
              value=""
              onChange={handleAddOffering}
              renderValue={() => (
                <span className="text-gray-400">Add more offerings...</span>
              )}
              MenuProps={{ PaperProps: { sx: { maxHeight: 400, width: 420 } } }}
            >
              {!offeringsLoading &&
                !offeringsError &&
                masterListOfferings?.map((item) => (
                  <MenuItem
                    className={` gap-3 ${
                      selectedOfferings.includes(item.id)
                        ? "bg-gray-100 pointer-events-none"
                        : ""
                    }`}
                    key={item.id}
                    value={item.id}
                    sx={{ py: 1.5, borderBottom: "1px solid #f0f0f0" }}
                  >
                    <div>
                      <Image
                        height={20}
                        width={20}
                        alt="Icon"
                        src={`${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/${item.s3_key}`}
                      />
                    </div>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#333",
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography sx={{ fontSize: "10px", color: "#888" }}>
                        {item.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
            </Select>

            <div className="flex flex-wrap gap-2 mt-3">
              {selectedOfferings.map((offeringId) =>
                masterListOfferings
                  ?.filter((item) => item.id === offeringId)
                  .map((item) => (
                    <Chip
                      key={item.id}
                      label={`${item.title}  `}
                      onClick={() => removeOffering(item.id)}
                      size="small"
                      className=" flex flex-row-reverse pr-2 bg-gray-100 rounded-md text-[10px] font-medium cursor-pointer hover:bg-gray-200"
                      sx={{ border: "none", height: "24px" }}
                      icon={
                        <CloseIcon className=" bg-primary text-white rounded-full text-[10px] p-px" />
                      }
                    />
                  ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((num) => (
              <div key={num} className="space-y-2">
                <label className=" flex flex-col justify-start items-start text-xs font-bold ">
                  Service Image ({num}
                  {num === 1 ? "st" : num === 2 ? "nd" : "rd"})
                  <span className="text-gray-400 flex items-center gap-1">
                    <span>
                      <HiInformationCircle className="text-sm" />
                    </span>
                    Maximum of 1 Image
                  </span>
                </label>

                <div
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = async (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        if (file.size > 4 * 1024 * 1024) {
                          toast.error("File size exceeds 4MB limit");
                          return;
                        }
                        try {
                          handleFileStateUpdate(num, file);
                        } catch (err) {
                          toast.error("Failed to add file");
                          console.log(err);
                        }
                      }
                    };
                    input.click();
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDragFileUpload(num, e)}
                  className="border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all"
                >
                  <Image
                    width={32}
                    height={32}
                    src="/images/svg/cloud-computing.png"
                    alt="upload icon"
                    className="opacity-40 mb-2"
                  />
                  <p className=" flex flex-col items-center gap-1 text-[10px] text-primary font-medium">
                    <span className="bg-secondary text-white px-4 rounded-2xl">
                      Browse
                    </span>
                    <span className="text-gray-400 font-normal">or</span>
                    <span className="text-gray-400 font-normal">
                      Drag a file to upload
                    </span>
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-[#888888]">
                  <span>Accepted formats: JPG, JPEG, PNG or WEBP</span>
                  <span>Maximum file size: 4MB</span>
                </div>

                {uploadedFiles[num] && (
                  <div className="flex items-center justify-between p-2 bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)]">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 bg-gray-200 overflow-hidden">
                        <Image
                          src={uploadedFiles[num]?.file_preview}
                          className="w-full h-full object-cover"
                          alt={uploadedFiles[num]?.file_preview}
                          width={40}
                          height={40}
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-800 truncate w-32">
                          {uploadedFiles[num]?.file_name}
                        </p>
                        <div className="w-28">
                          <p className=" grid grid-cols-2 text-[8px] text-gray-400">
                            Size: <span>{uploadedFiles[num]?.file_size}</span>
                          </p>
                          <p className=" grid grid-cols-2 text-[8px] text-gray-400">
                            Type: <span>{uploadedFiles[num]?.file_type}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <IconButton size="small" onClick={() => removeFile(num)}>
                      <FaRegTrashAlt className="text-gray-400 text-sm" />
                    </IconButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-10 pt-6 border-t border-gray-100">
          <Button
            onClick={onClose}
            variant="outlined"
            className="flex-1 py-3 border-gray-300 text-gray-600 font-bold capitalize rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateSpecialist}
            variant="contained"
            disabled={creating || updating}
            className="flex-1 py-3 bg-[#0A1D56] hover:bg-[#061133] font-bold capitalize rounded-xl shadow-none"
          >
            {creating || updating ? "Saving..." : "Confirm"}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default EditServiceDrawer;
