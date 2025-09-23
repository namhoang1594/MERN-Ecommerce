import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  clearSearchResults,
  fetchSearchResults,
} from "@/store/shop/search-slice";
import SidebarFilter from "@/components/shopping-view/products-Sidebar-Filter";
import ProductCard from "@/components/shopping-view/product-Card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { results, loading, error, total } = useSelector(
    (state: RootState) => state.shopSearchProduct
  );
  const query = searchParams.get("query") || "";

  useEffect(() => {
    if (query.trim()) {
      dispatch(fetchSearchResults(query.trim()));
    } else {
      dispatch(clearSearchResults());
    }
  }, [query, dispatch]);

  //   if (!query.trim()) {
  //     return <Navigate to="/" replace />;
  //   }

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-5 gap-6">
        {/* Sidebar Filter */}
        <div className="col-span-1">
          <SidebarFilter />
        </div>

        {/* Product Grid */}
        <div className="col-span-4 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Kết quả tìm kiếm cho: "{query}"
            </h2>
            {!loading && results.length > 0 && (
              <span className="text-gray-500">({total} sản phẩm)</span>
            )}
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Đang tìm sản phẩm...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500">Có lỗi xảy ra: {error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => dispatch(fetchSearchResults(query))}
              >
                Thử lại
              </Button>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                Không tìm thấy sản phẩm nào
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map((product) => (
                <ProductCard
                  key={product._id}
                  _id={product._id}
                  slug={product.slug}
                  title={product.title}
                  image={product.image}
                  category={product.category}
                  brand={product.brand}
                  price={product.price}
                  salePrice={product.salePrice}
                  totalStock={(product as any).totalStock}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
