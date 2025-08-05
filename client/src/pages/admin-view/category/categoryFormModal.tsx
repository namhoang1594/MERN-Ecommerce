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
import ImageUpload from "@/components/admin-view/image-upload";
import { UploadedResult } from "@/types/config/index.types";
import { ICategoryPayload } from "@/store/admin/category-slice/category.types";
import {
  createCategory,
  setCurrentCategory,
  updateCategory,
} from "@/store/admin/category-slice";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isEdit: boolean;
};

export default function CategoryFormModal({
  open,
  onClose,
  onSuccess,
  isEdit,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const currentCategory = useSelector(
    (state: RootState) => state.adminCategory.currentCategory
  );
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedResult, setUploadedResult] = useState<UploadedResult | null>(
    currentCategory?.image ?? null
  );
  const [imageLoading, setImageLoading] = useState(false);
  const [image, setImage] = useState<{ url: string; public_id: string }>({
    url: "",
    public_id: "",
  });

  useEffect(() => {
    if (isEdit && currentCategory) {
      setName(currentCategory.name || "");
      setImage(currentCategory.image || { url: "", public_id: "" });
      setUploadedResult(currentCategory.image || null);
    } else {
      setName("");
      setImage({ url: "", public_id: "" });
      setUploadedResult(null);
    }
  }, [isEdit, currentCategory, open]);

  const handleSubmit = async () => {
    if (!uploadedResult?.url || !uploadedResult?.public_id) return;
    const payload: ICategoryPayload = {
      name,
      image: uploadedResult,
    };

    if (isEdit && currentCategory?._id) {
      await dispatch(
        updateCategory({ id: currentCategory._id, data: payload })
      );
    } else {
      await dispatch(createCategory(payload));
    }
    onClose();
    onSuccess();
    dispatch(setCurrentCategory(null));
  };

  useEffect(() => {
    if (open && !isEdit) {
      setName("");
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
            {isEdit ? "Chỉnh sửa danh mục" : "Tạo mới danh mục"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Input
            placeholder="Tên danh mục"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            uploadFolder="categories"
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
