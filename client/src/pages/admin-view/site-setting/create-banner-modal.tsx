import { BannerPosition } from "@/store/admin/site-setting/banner-slice/banner.types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useState } from "react";
import { UploadedResult } from "@/types/config/index.types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBanner } from "@/store/admin/site-setting/banner-slice";
import ImageUpload from "@/components/common/image-upload";

interface CreateBannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: BannerPosition;
  setPosition: (pos: BannerPosition) => void;
  getPositionLabel: (pos: BannerPosition) => string;
}

const CreateBannerModal = ({
  open,
  onOpenChange,
  position,
  setPosition,
  getPositionLabel,
}: CreateBannerModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.adminBanner);

  // giữ nguyên toàn bộ form state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedResult, setUploadedResult] = useState<UploadedResult | null>(
    null
  );
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  const resetForm = () => {
    setImageFile(null);
    setUploadedResult(null);
    setTitle("");
    setLink("");
    setPosition(BannerPosition.MAIN);
  };

  const handleCreateBanner = async () => {
    if (!uploadedResult) {
      toast.error("Vui lòng upload ảnh banner");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile as File);
    if (title) formData.append("title", title);
    if (link) formData.append("link", link);
    formData.append("position", position);

    try {
      await dispatch(createBanner(formData)).unwrap();
      toast.success("Tạo banner thành công!");
      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error || "Lỗi khi tạo banner");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetForm();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm Banner Mới</DialogTitle>
          <DialogDescription>
            Upload ảnh và điền thông tin cho banner của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Image Upload */}
          <ImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedResult={uploadedResult}
            setUploadedResult={setUploadedResult}
            imageLoadingState={imageLoadingState}
            setImageLoadingState={setImageLoadingState}
            isEditMode={false}
            isCustomStyling={true}
            uploadApiUrl="http://localhost:5000/api/upload-image"
            label="Ảnh Banner *"
            uploadFolder="banners"
          />

          {/* Position Select */}
          <div>
            <Label>Vị trí hiển thị *</Label>
            <Select
              value={position}
              onValueChange={(val) => setPosition(val as BannerPosition)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BannerPosition.MAIN}>
                  {getPositionLabel(BannerPosition.MAIN)}
                </SelectItem>
                <SelectItem value={BannerPosition.SIDE_TOP}>
                  {getPositionLabel(BannerPosition.SIDE_TOP)}
                </SelectItem>
                <SelectItem value={BannerPosition.SIDE_BOTTOM}>
                  {getPositionLabel(BannerPosition.SIDE_BOTTOM)}
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-1">
              {position === BannerPosition.MAIN
                ? "Banner chính sẽ hiển thị dạng slider bên trái"
                : "Banner phụ sẽ hiển thị bên phải banner chính"}
            </p>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Tiêu đề (tuỳ chọn)</Label>
            <Input
              id="title"
              placeholder="VD: Flash Sale cuối năm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Link */}
          <div>
            <Label htmlFor="link">Đường dẫn (tuỳ chọn)</Label>
            <Input
              id="link"
              placeholder="VD: /collections/sale"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Để trống nếu không cần liên kết
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleCreateBanner}
            disabled={!uploadedResult || imageLoadingState || loading}
          >
            {loading ? "Đang tạo..." : "Tạo Banner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBannerModal;
