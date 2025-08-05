import { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { UploadedResult } from "@/types/config/index.types";

export type ImageUploadProps = {
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  uploadedResult: UploadedResult | null;
  setUploadedResult: (result: UploadedResult | null) => void;
  imageLoadingState: boolean;
  setImageLoadingState: (loading: boolean) => void;
  isEditMode: boolean;
  isCustomStyling?: boolean;
  uploadApiUrl: string;
  label?: string;
  uploadFolder: string;
};

function ImageUpload({
  imageFile,
  setImageFile,
  uploadedResult,
  setUploadedResult,
  imageLoadingState,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
  uploadApiUrl,
  label = "Upload Image",
  uploadFolder,
}: ImageUploadProps): React.ReactElement {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleImageFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedResult(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImage() {
    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", imageFile as File);
    data.append("folder", uploadFolder);
    try {
      const response = await axios.post(uploadApiUrl, data);
      if (response?.data?.success) {
        setUploadedResult(response.data.result);
      }
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImage();
  }, [imageFile]);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "mx-auto max-w-md"}`}>
      <Label className="text-lg font-semibold mb-2 block">{label}</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />

        {!imageFile && !uploadedResult ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex items-center gap-4">
            {uploadedResult?.url && (
              <img
                src={uploadedResult.url}
                alt="Uploaded"
                className="w-20 h-20 object-contain border rounded-md"
              />
            )}

            <div className="flex-1">
              <p className="text-sm font-medium">
                {imageFile?.name || "Đã có ảnh"}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleRemoveImage}
              >
                <XIcon className="w-4 h-4" />
                <span className="sr-only">Remove File</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
