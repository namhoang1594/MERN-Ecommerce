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

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();

  const { products, loading, filters, totalPages } = useSelector(
    (state: RootState) => state.shopAllProducts
  );

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

  const handleAddToCart = (id: string) => {
    console.log("Add to cart:", id);
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));

    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", String(page));

    navigate({
      pathname: "/products",
      search: searchParams.toString(),
    });
  };

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
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  _id={product._id}
                  slug={product.slug}
                  title={product.title}
                  image={product.image}
                  category={product.category?.name || ""}
                  brand={product.brand?.name || ""}
                  price={product.price}
                  salePrice={product.salePrice}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center">
            <Pagination
              currentPage={filters.page || 1}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
