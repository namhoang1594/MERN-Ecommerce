import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  createBanner,
  deleteBanner,
  fetchBanners,
  toggleBannerStatus,
} from "@/store/admin/site-setting/banner-slice";
import {
  BannerPosition,
  IBanner,
} from "@/store/admin/site-setting/banner-slice/banner.types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import DeleteModal from "@/components/common/delete-modal";
import { UploadedResult } from "@/types/config/index.types";
import CreateBannerModal from "./create-banner-modal";

const BannerManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { banners } = useSelector((state: RootState) => state.adminBanner);

  // Modal states
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState<string | null>(null);

  const [position, setPosition] = useState<BannerPosition>(BannerPosition.MAIN);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  const handleToggle = async (id: string) => {
    try {
      await dispatch(toggleBannerStatus(id)).unwrap();
      toast.success("Cập nhật trạng thái thành công!");
    } catch (error: any) {
      toast.error(error || "Lỗi khi toggle banner");
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedBannerId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedBannerId) {
      try {
        await dispatch(deleteBanner(selectedBannerId)).unwrap();
        toast.success("Xóa banner thành công!");
      } catch (error: any) {
        toast.error(error || "Lỗi khi xóa banner");
      }
    }
    setDeleteModalOpen(false);
    setSelectedBannerId(null);
  };

  // Group banners by position
  const mainBanners = banners.filter((b) => b.position === BannerPosition.MAIN);
  const sideTopBanners = banners.filter(
    (b) => b.position === BannerPosition.SIDE_TOP
  );
  const sideBottomBanners = banners.filter(
    (b) => b.position === BannerPosition.SIDE_BOTTOM
  );

  const getPositionLabel = (pos: BannerPosition) => {
    switch (pos) {
      case BannerPosition.MAIN:
        return "Banner chính (Slider)";
      case BannerPosition.SIDE_TOP:
        return "Banner phụ trên";
      case BannerPosition.SIDE_BOTTOM:
        return "Banner phụ dưới";
      default:
        return pos;
    }
  };

  const BannerCard = ({ banner }: { banner: IBanner }) => (
    <div className="relative border rounded-xl p-2 shadow hover:shadow-md transition-all">
      <img
        src={banner.image.url}
        alt={banner.title || "Banner"}
        className="w-full h-36 object-cover rounded-lg"
      />
      <div className="mt-2 text-sm space-y-1">
        {banner.title && (
          <p className="font-semibold truncate">{banner.title}</p>
        )}
        {banner.link && (
          <p className="text-gray-500 truncate text-xs">{banner.link}</p>
        )}
        <p className="text-gray-400 italic text-xs">
          {getPositionLabel(banner.position)}
        </p>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch
            checked={banner.isActive}
            onCheckedChange={() => handleToggle(banner._id)}
          />
          <span className="text-xs">{banner.isActive ? "Hiển thị" : "Ẩn"}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDeleteClick(banner._id)}
        >
          <Trash className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Quản lý Banner</h2>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm Banner
        </Button>
      </div>

      {/* Banner Lists */}
      <div className="space-y-6">
        {/* Main Banners */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            Banner Chính (Slider)
            <span className="text-sm text-gray-500 font-normal">
              ({mainBanners.length})
            </span>
          </h3>
          {mainBanners.length === 0 ? (
            <div className="border-2 border-dashed rounded-xl p-8 text-center text-gray-400">
              <p>Chưa có banner chính</p>
              <Button
                variant="link"
                onClick={() => {
                  setPosition(BannerPosition.MAIN);
                  setCreateModalOpen(true);
                }}
              >
                Thêm banner chính
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mainBanners.map((b) => (
                <BannerCard key={b._id} banner={b} />
              ))}
            </div>
          )}
        </div>

        {/* Side Banners */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Side Top */}
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              Banner Phụ Trên
              <span className="text-sm text-gray-500 font-normal">
                ({sideTopBanners.length})
              </span>
            </h3>
            {sideTopBanners.length === 0 ? (
              <div className="border-2 border-dashed rounded-xl p-6 text-center text-gray-400">
                <p className="text-sm">Chưa có banner phụ trên</p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => {
                    setPosition(BannerPosition.SIDE_TOP);
                    setCreateModalOpen(true);
                  }}
                >
                  Thêm banner
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sideTopBanners.map((b) => (
                  <BannerCard key={b._id} banner={b} />
                ))}
              </div>
            )}
          </div>

          {/* Side Bottom */}
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              Banner Phụ Dưới
              <span className="text-sm text-gray-500 font-normal">
                ({sideBottomBanners.length})
              </span>
            </h3>
            {sideBottomBanners.length === 0 ? (
              <div className="border-2 border-dashed rounded-xl p-6 text-center text-gray-400">
                <p className="text-sm">Chưa có banner phụ dưới</p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => {
                    setPosition(BannerPosition.SIDE_BOTTOM);
                    setCreateModalOpen(true);
                  }}
                >
                  Thêm banner
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sideBottomBanners.map((b) => (
                  <BannerCard key={b._id} banner={b} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Banner Modal */}
      <CreateBannerModal
        open={isCreateModalOpen}
        onOpenChange={setCreateModalOpen}
        position={position}
        setPosition={setPosition}
        getPositionLabel={getPositionLabel}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default BannerManager;
