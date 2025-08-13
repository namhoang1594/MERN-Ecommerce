import { useEffect } from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchBannersForShop } from "@/store/shop/home/banner-slice";
import { Skeleton } from "@/components/ui/skeleton";

const HeroBanner = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { banners: banners, loading } = useSelector(
    (state: RootState) => state.adminBanner
  );

  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: "free-snap",
    slides: { perView: 1 },
  });

  useEffect(() => {
    dispatch(fetchBannersForShop());
  }, [dispatch]);

  if (loading) {
    return <Skeleton className="w-full h-[200px] md:h-[400px] rounded-xl" />;
  }

  return (
    <div
      ref={sliderRef}
      className="keen-slider w-full overflow-hidden rounded-xl"
    >
      {banners.map((banner) => (
        <div
          key={banner._id}
          className="keen-slider__slide relative h-[200px] md:h-[400px]"
        >
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover rounded-xl"
          />
          {banner.link && (
            <Link
              to={banner.link}
              className="absolute bottom-5 left-5 bg-black/50 text-white px-4 py-2 rounded"
            >
              Xem chi tiết
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default HeroBanner;
