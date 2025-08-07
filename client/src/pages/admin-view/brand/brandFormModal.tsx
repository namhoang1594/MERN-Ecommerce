import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import ImageUpload from "@/components/common/image-upload";
import {
  createBrand,
  setCurrentBrand,
  updateBrand,
} from "@/store/admin/brand-slice";
import { IBrandPayload } from "@/store/admin/brand-slice/brand.types";
import { UploadedResult } from "@/types/config/index.types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isEdit: boolean;
};

export default function BrandFormModal({
  open,
  onClose,
  onSuccess,
  isEdit,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const currentBrand = useSelector(
    (state: RootState) => state.adminBrand.currentBrand
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedResult, setUploadedResult] = useState<UploadedResult | null>(
    currentBrand?.image ?? null
  );
  const [imageLoading, setImageLoading] = useState(false);
  const [image, setImage] = useState<{ url: string; public_id: string }>({
    url: "",
    public_id: "",
  });

  useEffect(() => {
    if (isEdit && currentBrand) {
      setName(currentBrand.name || "");
      setDescription(currentBrand.description || "");
      setImage(currentBrand.image || { url: "", public_id: "" });
      setUploadedResult(currentBrand.image || null);
    } else {
      setName("");
      setDescription("");
      setImage({ url: "", public_id: "" });
      setUploadedResult(null);
    }
  }, [isEdit, currentBrand, open]);

  const handleSubmit = async () => {
    if (!uploadedResult?.url || !uploadedResult?.public_id) return;
    const payload: IBrandPayload = {
      name,
      description,
      image: uploadedResult,
    };

    if (isEdit && currentBrand?._id) {
      await dispatch(updateBrand({ id: currentBrand._id, data: payload }));
    } else {
      await dispatch(createBrand(payload));
    }
    onClose();
    onSuccess();
    dispatch(setCurrentBrand(null));
  };

  useEffect(() => {
    if (open && !isEdit) {
      setName("");
      setDescription("");
      setImage({ url: "", public_id: "" });
      setUploadedResult(null);
      setImageFile(null);
    }
  }, [open, isEdit]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Chỉnh sửa thương hiệu" : "Tạo mới thương hiệu"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Input
            placeholder="Tên thương hiệu"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Mô tả (tùy chọn)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <ImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedResult={uploadedResult}
            setUploadedResult={setUploadedResult}
            imageLoadingState={imageLoading}
            setImageLoadingState={setImageLoading}
            isEditMode={false}
            uploadApiUrl="http://localhost:5000/api/upload-image"
            uploadFolder="brands"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Huỷ
          </Button>
          <Button onClick={handleSubmit}>
            {isEdit ? "Lưu thay đổi" : "Tạo mới"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
