import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  createBanner,
  deleteBanner,
  fetchBanners,
  toggleBannerStatus,
} from "@/store/admin/site-setting/banner-slice";
import { IBanner } from "@/store/admin/site-setting/banner-slice/banner.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import ConfirmModal from "@/components/common/confirm-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BannerManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { banners, loading } = useSelector(
    (state: RootState) => state.adminBanner
  );

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [position, setPosition] = useState<"home" | "sale" | "custom">("home");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type.startsWith("image/")) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("link", link);
    formData.append("position", position);

    dispatch(createBanner(formData)).then(() => {
      setFile(null);
      setPreview(null);
      setTitle("");
      setLink("");
      setPosition("home");
      dispatch(fetchBanners());
    });
  };

  const handleToggle = (id: string, currentStatus: boolean) => {
    dispatch(toggleBannerStatus({ id, isActive: !currentStatus }));
  };

  const handleDeleteClick = (id: string) => {
    setSelectedBannerId(id);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBannerId) {
      dispatch(deleteBanner(selectedBannerId)).then(() => {
        toast.success("Xoá banner thành công!");
      });
    }
    setDialogOpen(false);
    setSelectedBannerId(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Quản lý Banner</h2>

      {/* Upload zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-dashed border-2 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-blue-500"
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-60 rounded-lg" />
        ) : (
          <p>Kéo thả ảnh vào đây hoặc click để chọn</p>
        )}
        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      {/* Text inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Tiêu đề</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="link">Đường dẫn</Label>
          <Input
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Vị trí</Label>
          <Select
            value={position}
            onValueChange={(val) => setPosition(val as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn vị trí hiển thị" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">Trang chủ</SelectItem>
              <SelectItem value="sale">Khuyến mãi</SelectItem>
              <SelectItem value="custom">Tuỳ chỉnh</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleUpload} disabled={!file}>
        Upload Banner
      </Button>

      {/* Banner list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          banners.map((b: IBanner) => (
            <div
              key={b._id}
              className="relative border rounded-xl p-2 shadow hover:shadow-md transition-all"
            >
              <img
                src={b.image}
                alt="Banner"
                className="w-full h-36 object-cover rounded-lg"
              />
              <div className="mt-2 text-sm">
                <p className="font-semibold">{b.title}</p>
                <p className="text-gray-500">{b.link}</p>
                <p className="text-gray-400 italic">Vị trí: {b.position}</p>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={b.isActive}
                    onCheckedChange={() => handleToggle(b._id, b.isActive)}
                  />
                  <span>{b.isActive ? "Hiển thị" : "Ẩn"}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(b._id as string)}
                >
                  <Trash className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default BannerManager;
