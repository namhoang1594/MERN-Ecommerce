import HeroBanner from "./bannerSection";
import CategoryList from "./categoryListSection";
import FlashSaleSection from "./flashSaleSection";
import SuggestionProduct from "./suggestionProductSection";
import NewArrivalSection from "./newArrivalSection";

export default function HomePage() {
  return (
    <div className="space-y-10 pb-20">
      <HeroBanner />
      <section className="px-4 md:px-10">
        <h2 className="text-2xl font-semibold mb-4">Danh mục nổi bật</h2>
        <CategoryList />
      </section>
      <section className="px-4 md:px-10">
        <h2 className="text-2xl font-semibold mb-4">Flash Sale</h2>
        <FlashSaleSection />
      </section>
      <SuggestionProduct />
      <NewArrivalSection />
      <footer className="mt-10 py-10 bg-gray-100 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} E-Shop. All rights reserved.
      </footer>
    </div>
  );
}
