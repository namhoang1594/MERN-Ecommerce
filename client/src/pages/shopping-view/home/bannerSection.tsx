import { useEffect } from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchBannersForShop } from "@/store/shop/home/banner-slice";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BannerPosition,
  IBanner,
} from "@/store/admin/site-setting/banner-slice/banner.types";
import { fetchPublicBanners } from "@/store/admin/site-setting/banner-slice";

const HeroBanner = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { banners, loading } = useSelector(
    (state: RootState) => state.adminBanner
  );

  // Filter banners by position
  const mainBanners = banners.filter(
    (b) => b.position === BannerPosition.MAIN && b.isActive
  );
  const sideTopBanner = banners.find(
    (b) => b.position === BannerPosition.SIDE_TOP && b.isActive
  );
  const sideBottomBanner = banners.find(
    (b) => b.position === BannerPosition.SIDE_BOTTOM && b.isActive
  );

  // Keen Slider for main banners
  const [sliderRef] = useKeenSlider(
    {
      loop: mainBanners.length > 1,
      mode: "snap",
      slides: { perView: 1 },
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;

        function clearNextTimeout() {
          clearTimeout(timeout);
        }

        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 4000); // Auto slide every 4s
        }

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });

        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  useEffect(() => {
    dispatch(fetchPublicBanners({}));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Skeleton className="col-span-1 lg:col-span-2 h-[250px] md:h-[400px] rounded-xl" />
        <div className="hidden lg:flex flex-col gap-4">
          <Skeleton className="h-[196px] rounded-xl" />
          <Skeleton className="h-[196px] rounded-xl" />
        </div>
      </div>
    );
  }

  // If no banners available
  if (mainBanners.length === 0 && !sideTopBanner && !sideBottomBanner) {
    return (
      <div className="w-full h-[250px] md:h-[400px] bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">
            Chào mừng đến với cửa hàng
          </h2>
          <p className="text-lg opacity-90">Khám phá sản phẩm của chúng tôi</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Main Banner Slider - Left (2/3 width on desktop) */}
      <div className="col-span-1 lg:col-span-2">
        {mainBanners.length > 0 ? (
          <div
            ref={sliderRef}
            className="keen-slider rounded-xl overflow-hidden shadow-lg"
          >
            {mainBanners.map((banner) => (
              <div
                key={banner._id}
                className="keen-slider__slide relative h-[250px] md:h-[400px]"
              >
                <img
                  src={banner.image.url}
                  alt={banner.title || "Banner"}
                  className="w-full h-full object-cover"
                />
                {/* Overlay gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Banner content */}
                {(banner.title || banner.link) && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    {banner.title && (
                      <h3 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">
                        {banner.title}
                      </h3>
                    )}
                    {banner.link && (
                      <Link
                        to={banner.link}
                        className="inline-block bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
                      >
                        Xem chi tiết
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[250px] md:h-[400px] bg-gray-200 rounded-xl flex items-center justify-center">
            <p className="text-gray-500">Không có banner chính</p>
          </div>
        )}
      </div>

      {/* Mini Banners - Right (1/3 width on desktop, hidden on mobile) */}
      <div className="hidden lg:flex flex-col gap-4">
        {/* Top Mini Banner */}
        <MiniBanner banner={sideTopBanner} position="top" />

        {/* Bottom Mini Banner */}
        <MiniBanner banner={sideBottomBanner} position="bottom" />
      </div>
    </div>
  );
};

// Mini Banner Component
const MiniBanner = ({
  banner,
  position,
}: {
  banner?: IBanner;
  position: "top" | "bottom";
}) => {
  if (!banner) {
    return (
      <div className="h-[196px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
        <p className="text-gray-400 text-sm">
          Banner phụ {position === "top" ? "trên" : "dưới"}
        </p>
      </div>
    );
  }

  const content = (
    <div className="relative h-[196px] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
      <img
        src={banner.image.url}
        alt={banner.title || "Mini banner"}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

      {/* Title if exists */}
      {banner.title && (
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-semibold text-sm md:text-base drop-shadow-lg line-clamp-2">
            {banner.title}
          </p>
        </div>
      )}
    </div>
  );

  // Wrap with link if available
  return banner.link ? (
    <Link to={banner.link} className="block">
      {content}
    </Link>
  ) : (
    content
  );
};

export default HeroBanner;
