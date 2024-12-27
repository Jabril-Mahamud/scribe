"use client";

import { useRouter } from "next/navigation";
import { useUploadThing } from "~/utils/uploadthing";
import { toast } from "sonner";
import React from "react";

// Inferred input off useUploadThing
type Input = Parameters<typeof useUploadThing>;

const useUploadThingInputProps = (...args: Input) => {
  const $ut = useUploadThing(...args);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    // Trigger upload start toast
    toast(
      <div className="flex items-center gap-2 text-white">
        <LoadingSpinnerSVG /> <span>Uploading...</span>
      </div>,
      {
        duration: 100000,
        id: "upload-begin",
        style: { background: "#000", borderRadius: "8px" }, // Add custom styling
      }
    );

    try {
      const result = await $ut.startUpload(selectedFiles);

      console.log("uploaded files", result);
      toast.dismiss("upload-begin");
      toast("Upload Complete!", {
        duration: 5000,
        id: "upload-complete",
        style: { background: "#16a34a", color: "#fff", borderRadius: "8px" },
      });
      // TODO: Persist result in state or trigger actions if needed
    } catch (error) {
      toast.dismiss("upload-begin");
      toast("Upload Failed. Please try again.", {
        duration: 5000,
        id: "upload-error",
        style: { background: "#dc2626", color: "#fff", borderRadius: "8px" },
      });
    }
  };

  return {
    inputProps: {
      onChange,
      multiple: ($ut.routeConfig?.image?.maxFileCount ?? 1) > 1,
      accept: "image/*",
    },
    isUploading: $ut.isUploading,
  };
};

function UploadSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
      />
    </svg>
  );
}

function LoadingSpinnerSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="spinner"
      viewBox="0 0 50 50"
      width="50"
      height="50"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        strokeDasharray="100"
        strokeDashoffset="75"
      />
      <style>
        {`
          .spinner {
            transform-origin: center;
            animation: spin 0.75s linear infinite;
          }
          @keyframes spin {
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </svg>
  );
}

export function SimpleUploadButton() {
  const router = useRouter();

  const { inputProps } = useUploadThingInputProps("imageUploader", {
    onUploadBegin() {
      // Custom action on upload start, if any
    },
    onClientUploadComplete() {
      router.refresh();
    },
  });

  return (
    <div>
      <label
        htmlFor="upload-button"
        className="flex cursor-pointer items-center"
      >
        <UploadSVG />
        <span className="ml-2">Upload Image</span>
      </label>
      <input
        id="upload-button"
        type="file"
        className="sr-only"
        {...inputProps}
      />
    </div>
  );
}
