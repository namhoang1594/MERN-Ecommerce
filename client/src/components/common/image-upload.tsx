import { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { UploadedResult } from "@/types/config/index.types";
import { AspectRatio } from "../ui/aspect-ratio";

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
      <Label className="text-base font-medium mb-2 block">{label}</Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 transition-all ${
          isEditMode ? "opacity-60 cursor-not-allowed" : "hover:bg-muted/20"
        }`}
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
            className="flex flex-col items-center justify-center gap-2 h-32 cursor-pointer text-muted-foreground"
          >
            <UploadCloudIcon className="w-8 h-8" />
            <span>Click or drag & drop to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-32 w-full rounded-md" />
        ) : (
          <div className="flex items-center gap-4">
            {uploadedResult?.url && (
              <AspectRatio ratio={1} className="w-20">
                <img
                  src={uploadedResult.url}
                  alt="Uploaded"
                  className="w-full h-full object-contain rounded-md border"
                />
              </AspectRatio>
            )}
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium truncate max-w-[200px]">
                {imageFile?.name || "Đã có ảnh"}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
                className="text-muted-foreground hover:text-destructive px-2"
              >
                <XIcon className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
