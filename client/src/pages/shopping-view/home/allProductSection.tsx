import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { fetchAllProductsForShop } from "@/store/shop/home/allProducts-slice";
import { Pagination } from "@/components/common/pagination";

const ProductGridSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, pagination } = useSelector(
    (state: RootState) => state.shopAllProducts
  );

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllProductsForShop({ page: currentPage, limit: 8 }));
  }, [dispatch, currentPage]);

  return (
    <section className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🛍️ Danh sách sản phẩm</h2>
        <Link to="/products" className="text-sm text-blue-500 hover:underline">
          Xem tất cả
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="border rounded-xl p-4 flex flex-col hover:shadow transition"
              >
                <img
                  src={product.image?.[0]?.url}
                  alt={product.title}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h3 className="font-medium text-base mb-1">{product.title}</h3>
                <p className="text-red-500 font-semibold">
                  {product.salePrice || product.price}₫
                </p>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </section>
  );
};

export default ProductGridSection;
