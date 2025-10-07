import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { fetchSuggestionProductsForShop } from "@/store/shop/home/suggestionProduct-slice";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const SuggestionProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector(
    (state: RootState) => state.shopSuggestionProduct
  );

  useEffect(() => {
    dispatch(fetchSuggestionProductsForShop());
  }, [dispatch]);

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🎯 Gợi ý hôm nay</h2>
        <Link to="/products" className="text-sm text-blue-500 hover:underline">
          Xem tất cả
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <Link
              to={`/products/${product.slug}`}
              key={product._id}
              className="group relative border rounded-xl overflow-hidden hover:shadow-xl hover:shadow-red-100/50 transition-all duration-300 hover:-translate-y-1 bg-white"
            >
              {/* Product Image - Full Width */}
              <div className="relative overflow-hidden">
                <AspectRatio ratio={1 / 1}>
                  <img
                    src={product.image[0]?.url}
                    alt={product.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </AspectRatio>

                {/* Overlay gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Product Info */}
              <div className="p-3 flex flex-col gap-2">
                <p className="font-medium text-sm line-clamp-2 min-h-[40px] text-gray-800 group-hover:text-gray-900 transition-colors">
                  {product.title}
                </p>

                {/* Price Section */}
                <div className="flex items-center justify-between">
                  <p className="font-bold text-red-600 text-base bg-red-50 px-2 py-1 rounded-md">
                    {(product.salePrice || product.price).toLocaleString()}₫
                  </p>
                </div>
              </div>

              {/* Subtle animation border on hover */}
              <div className="absolute inset-0 rounded-xl border-2 border-red-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestionProducts;
