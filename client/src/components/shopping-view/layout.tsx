import { Outlet, useLocation } from "react-router-dom";
import ShopHeader from "./header";
import HeroBanner from "@/pages/shopping-view/home/bannerSection";

function ShoppingLayout() {
  const location = useLocation();
  const pathname = location.pathname;
  const hideBanner = pathname === "/cart" || pathname.startsWith("/products/");
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* common header */}
      <ShopHeader />
      <div className="pb-5 pt-25">{!hideBanner && <HeroBanner />}</div>
      <main className="flex flex-col w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;
