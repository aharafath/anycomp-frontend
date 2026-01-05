import React, { useMemo, useState } from "react";
import { Button, Avatar, Divider, Box, Modal, Typography } from "@mui/material";
import Image from "next/image";
import { Error } from "@mui/icons-material";
import { Specialist } from "@/lib/services/specialistApiSlice";
import { useUpdateSpecialistDraftMutation } from "@/lib/services/specialistApiSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Props {
  onEditOpen: () => void;
  specialist?: Specialist | null;
}

const ServicePreview: React.FC<Props> = ({ onEditOpen, specialist }) => {
  const router = useRouter();

  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [updateDraft, { isLoading: updatingDraft }] =
    useUpdateSpecialistDraftMutation();

  const handlePublishClick = () => {
    if (!specialist?.id) {
      toast.info("Create and save your service before publishing.");
      return;
    }
    setPublishModalOpen(true);
  };

  const handleSaveAndPublish = async () => {
    if (!specialist?.id) {
      setPublishModalOpen(false);
      return;
    }
    try {
      await updateDraft({
        id: specialist.id,
        data: { is_draft: false },
      }).unwrap();

      toast.success("Service published successfully");
      router.push("/");
    } catch {
      toast.error("Failed to publish service");
    } finally {
      setPublishModalOpen(false);
    }
  };

  const galleryImages = useMemo(() => {
    return specialist?.media?.slice(0, 3).map((m) => ({
      src: `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}${m.file_name}`,
      alt: specialist?.title ?? "Service media",
    }));
  }, [specialist]);

  const serviceTitle =
    specialist?.title || "Register a new company | Private Limited - Sdn Bhd";
  const serviceDescription =
    specialist?.description ||
    "Describe your service here. Add key details to help clients understand what you offer.";
  const servicePrice =
    specialist?.base_price !== undefined ? Number(specialist.base_price) : 1800;

  return (
    <div className=" max-w-6xl  mx-auto p-10">
      <div className="flex gap-10">
        {/* Left: Content Area */}
        <div className="flex-2">
          <h1 className="text-3xl font-bold text-gray-800 leading-tight">
            {serviceTitle}
          </h1>
          <div className="grid grid-cols-2 gap-4 mb-10 mt-3">
            <div className="row-span-2 h-100 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center flex-col">
              <div className="w-16 h-16  mb-2 flex items-center justify-center">
                <Image
                  width={200}
                  height={200}
                  src="/images/svg/photo-scan.svg"
                  alt="Office"
                  className="object-cover w-full h-full opacity-80"
                />
              </div>
              <p className="text-primary text-xs text-left px-10">
                Upload an image for your service listing in PNG, JPG or JPEG up
                to 4MB
              </p>
            </div>
            {(galleryImages?.length
              ? galleryImages
              : [
                  { src: "/images/service_main_1.png", alt: serviceTitle },
                  { src: "/images/service_main_2.png", alt: serviceTitle },
                ]
            ).map((item, index) => (
              <div key={index} className="h-50">
                <Image
                  width={300}
                  height={200}
                  src={item.src}
                  alt={item.alt || serviceTitle}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
            ))}
          </div>

          <section className="mb-10">
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <p className="text-gray-500 text-sm whitespace-pre-line">
              {serviceDescription}
            </p>
            <Divider className="mt-8" />
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold mb-2">Additional Offerings</h2>
            <p className="text-gray-500 text-sm">
              Enhance your service by adding additional offerings
            </p>
            <Divider className="mt-8" />
          </section>

          <section className="grid grid-cols-2">
            <div>
              <h2 className="text-xl font-bold mb-6">Company Secretary</h2>
              <div className="flex gap-4">
                <Avatar src="/grace.jpg" className="w-14 h-14" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      {specialist?.title || "Grace Lam"}
                    </span>
                    <span className="text-[10px]  px-1 flex items-center gap-1">
                      <span className="bg-green-600 text-white size-3 text-[5px] flex items-center justify-center rounded-full">
                        ✔
                      </span>
                      Verified
                    </span>
                  </div>
                  <p className="text-xs  font-medium">
                    Corpsec Services Sdn Bhd
                  </p>
                  <div className="flex gap-4 mt-1">
                    <button className="text-[10px] bg-[#0A1D56] text-white px-3 py-1 rounded">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs pt-3">
                A company secretarial service founded by Grace, who believes
                that every company deserves clarity, confidence, and care in
                their compliance journey. Inspired by the spirit of
                entrepreneurship, Aida treats every client’s business as if it
                were her own — attentive to detail, committed to deadlines, and
                focused on growth. Step into a partnership built on trust,
                transparency, and professional excellence. Whether you’re just
                starting out or managing a growing company, Aida is here to make
                your corporate governance smooth, secure, and stress-free. Your
                company’s peace of mind starts here
              </p>
            </div>
            <div className="sm:pl-20">
              <h2>Certified Company Secretary</h2>
              <div className="flex items-center">
                {[
                  { src: "/images/service_1.png", alt: serviceTitle },
                  { src: "/images/service_2.png", alt: serviceTitle },
                  { src: "/images/service_3.png", alt: serviceTitle },
                ].map((img, idx) => (
                  <div key={idx} className="w-32">
                    <Image
                      width={300}
                      height={200}
                      src={img.src}
                      alt={img.alt}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right: Price Card */}
        <div className="flex-1">
          <div className=" sticky top-10">
            <div className="flex gap-3">
              <Button
                onClick={onEditOpen}
                variant="contained"
                className="bg-primary hover:bg-secondary capitalize px-8 py-2 rounded-lg font-bold"
              >
                Edit
              </Button>
              <Button
                onClick={handlePublishClick}
                variant="contained"
                disabled={!specialist?.id || updatingDraft}
                className="bg-secondary hover:bg-primary capitalize px-8 py-2 rounded-lg font-bold disabled:opacity-60"
              >
                {specialist?.verification_status === "APPROVED" &&
                !specialist?.is_draft
                  ? "Published"
                  : "Publish"}
              </Button>
            </div>
            <Box className="bg-white border border-gray-100 shadow-2xl p-8  mt-3">
              <h3 className="text-2xl font-bold ">Professional Fee</h3>
              <p className=" text-xs mt-1 mb-8">Set a rate for your service</p>

              <div className="text-center mb-10">
                <span className="text-4xl font-bold border-b-4 border-gray-800 pb-1 px-2 inline-block">
                  RM {servicePrice.toLocaleString()}
                </span>
              </div>

              <div className="space-y-1 text-sm ">
                <div className="flex justify-between font-medium ">
                  <span>Base price</span>
                  <span className="font-bold">
                    RM {servicePrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between  font-medium">
                  <span className="underline ">Service processing fee</span>
                  <span className="font-bold">
                    RM {specialist?.platform_fee?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-medium ">
                  <span>Total</span>
                  <span className="font-bold">
                    RM{" "}
                    {(
                      Number(specialist?.base_price) +
                      Number(specialist?.platform_fee)
                    ).toLocaleString()}
                  </span>
                </div>
                <Divider />
                <div className="flex justify-between font-medium ">
                  <span>Your returns</span>
                  <span className="font-bold">
                    RM {Number(specialist?.base_price).toLocaleString()}
                  </span>
                </div>
              </div>
            </Box>
          </div>
        </div>
      </div>

      {/* --- Publish Changes Modal --- */}
      <Modal
        open={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        aria-labelledby="publish-modal-title"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            width: 700,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 24,
            p: 0,
            outline: "none",
            overflow: "hidden",
          }}
        >
          <div className="p-8 flex flex-col items-start">
            <div className="flex items-start gap-2 mb-4">
              <div className="mt-1">
                <Error sx={{ fontSize: 25, color: "#0A1D56" }} />
              </div>
              <div>
                <Typography
                  id="publish-modal-title"
                  variant="h5"
                  className="font-bold text-secondary"
                >
                  Publish changes
                </Typography>
                <Typography className="text-primary mt-2 text-[15px]">
                  Do you want to publish these changes? It will appear in the
                  marketplace listing
                </Typography>
              </div>
            </div>

            {/* Modal Footer Buttons */}
            <div className="flex justify-end gap-3 w-full mt-6">
              <Button
                onClick={() => setPublishModalOpen(false)}
                variant="outlined"
                className="border-gray-300 text-primary font-bold capitalize px-6 py-2 rounded-md hover:bg-gray-50"
                sx={{ textTransform: "none", fontWeight: "bold" }}
              >
                Continue Editing
              </Button>
              <Button
                onClick={handleSaveAndPublish}
                variant="contained"
                disabled={updatingDraft}
                className="bg-secondary hover:bg-primary text-white font-bold capitalize px-6 py-2 rounded-md shadow-none disabled:opacity-60"
                sx={{ textTransform: "none", fontWeight: "bold" }}
              >
                {updatingDraft ? "Publishing..." : "Save changes"}
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ServicePreview;
