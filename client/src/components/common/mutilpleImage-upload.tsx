import { useRef, useState } from "react";
import axios from "axios";
import { UploadCloudIcon, XIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { UploadedResult } from "@/types/config/index.types";

interface MultipleImageUploadProps {
  value: UploadedResult[];
  onChange: (
    newImages: UploadedResult[],
    removedImages: UploadedResult[]
  ) => void;
  uploadApiUrl: string;
  uploadFolder: string;
  label?: string;
}

export function MultipleImageUpload({
  value,
  onChange,
  uploadApiUrl,
  uploadFolder,
  label = "Ảnh sản phẩm",
}: MultipleImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFiles = async (files: FileList) => {
    setLoading(true);

    const uploads = await Promise.all(
      Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("my_file", file);
        formData.append("folder", uploadFolder);

        try {
          const res = await axios.post(uploadApiUrl, formData);
          return res?.data?.success ? res.data.result : null;
        } catch (err) {
          console.error("Upload failed:", file.name);
          return null;
        }
      })
    );

    const successfulUploads = uploads.filter(Boolean) as UploadedResult[];
    onChange([...value, ...successfulUploads], []);
    setLoading(false);
  };

  const handleRemove = (index: number) => {
    const removed = value[index];
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages, [removed]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  return (
    <div>
      <Label className="block mb-2">{label}</Label>

      {/* Dropzone */}
      <div
        className="border-2 border-dashed rounded-xl p-6 w-full text-center cursor-pointer hover:bg-muted/40 transition"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <UploadCloudIcon className="mx-auto w-8 h-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          Kéo thả hoặc bấm để tải lên ảnh
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          disabled={loading}
          ref={inputRef}
          onChange={handleFileChange}
        />
      </div>

      {/* Preview images */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4 max-h-[300px] overflow-y-auto">
        {loading && (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        )}

        {value.map((img, idx) => (
          <div
            key={idx}
            className="relative group w-full aspect-square overflow-hidden rounded-lg border"
          >
            <img
              src={img.url}
              alt={img.url || `uploaded-${idx}`}
              className="object-cover w-full h-full"
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1 right-1 bg-white shadow-md rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              data-testid={`remove-image-${idx}`}
            >
              <XIcon className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
