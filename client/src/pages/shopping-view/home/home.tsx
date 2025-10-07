import HeroBanner from "./bannerSection";
import CategoryList from "./categoryListSection";
import FlashSaleSection from "./flashSaleSection";
import SuggestionProduct from "./suggestionProductSection";
import NewArrivalSection from "./newArrivalSection";
import Footer from "./sectionFooter";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="px-4 md:px-10">
        <h2 className="text-2xl font-semibold mb-4">Danh mục nổi bật</h2>
        <CategoryList />
      </section>
      <section className="px-4 md:px-10">
        <h2 className="text-2xl font-semibold mb-4">Flash Sale</h2>
        <FlashSaleSection />
      </section>
      <section className="px-4 md:px-10">
        <SuggestionProduct />
      </section>
      <section className="px-4 md:px-10">
        <NewArrivalSection />
      </section>
      <Footer />
    </div>
  );
}
