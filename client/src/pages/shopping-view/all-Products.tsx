import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import SidebarFilter from "@/components/shopping-view/products-Sidebar-Filter";
import ProductCard from "@/components/shopping-view/product-Card";
import {
  fetchShopProducts,
  setFilters,
  setPage,
} from "@/store/shop/products-slice/allProducts-slice";
import { useLocation, useNavigate } from "react-router-dom";
import { Pagination } from "@/components/common/pagination";
import { Loader2 } from "lucide-react";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const { products, loading, filters, totalPages, error } = useSelector(
    (state: RootState) => state.shopAllProducts
  );
  // const { isLoggedIn } = useSelector((state: RootState) => state.shopCart);

  // Lấy query params từ URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    dispatch(
      setFilters({
        category: searchParams.get("category") || undefined,
        brand: searchParams.get("brand") || undefined,
        priceMin: searchParams.get("priceMin")
          ? Number(searchParams.get("priceMin"))
          : undefined,
        priceMax: searchParams.get("priceMax")
          ? Number(searchParams.get("priceMax"))
          : undefined,
        sort: searchParams.get("sort") || undefined,
        search: searchParams.get("search") || undefined,
        page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
        limit: searchParams.get("limit")
          ? Number(searchParams.get("limit"))
          : 12,
      })
    );
  }, [location.search, dispatch]);

  useEffect(() => {
    if (filters) {
      dispatch(fetchShopProducts());
    }
  }, [dispatch, filters]);

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", String(page));
    navigate({
      pathname: "/products",
      search: searchParams.toString(),
    });
  };

  if (error) {
    return (
      <div className="container mx-auto py-6 text-center">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={() => dispatch(fetchShopProducts())}
          className="text-blue-500 hover:underline"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-5 gap-6">
        {/* Sidebar Filter */}
        <div className="col-span-1">
          <SidebarFilter />
        </div>

        {/* Product Grid */}
        <div className="col-span-4 space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Đang tải sản phẩm...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                Không tìm thấy sản phẩm nào
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
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

          {/* Pagination */}
          {!loading && products.length > 0 && totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={filters.page || 1}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
