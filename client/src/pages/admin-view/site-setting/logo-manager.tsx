import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { RootState } from "@/store/store";
import {
  deleteLogo,
  fetchSetting,
  toggleLogo,
  uploadLogo,
} from "@/store/admin/site-setting/setting-slice";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import ConfirmModal from "@/components/common/confirm-modal";

const LogoManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedLogoId, setSelectedLogoId] = useState<string | null>(null);
  const { logos, loading } = useSelector(
    (state: RootState) => state.adminSetting
  );

  useEffect(() => {
    dispatch(fetchSetting());
  }, [dispatch]);

  const handleDelete = (public_id: string) => {
    dispatch(deleteLogo(public_id));
    setDialogOpen(true);
  };
  const confirmDelete = () => {
    if (selectedLogoId) {
      dispatch(deleteLogo(selectedLogoId)).then(() => {
        toast.success("Xoá banner thành công!");
      });
    }
    setDialogOpen(false);
    setSelectedLogoId(null);
  };

  const handleToggle = (public_id: string) => {
    dispatch(toggleLogo(public_id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(uploadLogo(file));
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) {
        dispatch(uploadLogo(file));
      }
    },
    [dispatch]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        className="border-dashed border-2 border-gray-300 p-6 rounded-lg text-center cursor-pointer hover:border-blue-500 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById("logo-upload")?.click()}
      >
        <Upload className="mx-auto h-6 w-6 mb-2" />
        <p className="text-sm">Click hoặc kéo ảnh logo vào đây để upload</p>
        <input
          id="logo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {logos.map((logo) => (
          <div
            key={logo.public_id}
            className="relative border rounded-lg p-2 shadow-sm flex flex-col items-center"
          >
            <img
              src={logo.image}
              alt="logo"
              width={100}
              height={100}
              className="object-contain"
            />

            <div className="mt-2 flex items-center gap-2">
              <Switch
                checked={logo.isActive}
                onCheckedChange={() => handleToggle(logo.public_id)}
              />
              <span className="text-sm">Active</span>
            </div>

            <Button
              size="icon"
              variant="destructive"
              className="absolute top-1 right-1"
              onClick={() => handleDelete(logo.public_id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      <ConfirmModal
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default LogoManager;
