import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AppDispatch, RootState } from "@/store/store";
import { formatCurrency } from "@/lib/utils";
import { fetchFlashSaleForShop } from "@/store/shop/home/flashSale-slice";

const FlashSaleList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector(
    (state: RootState) => state.shopFlashSale
  );

  useEffect(() => {
    dispatch(fetchFlashSaleForShop());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {products.map((product) => (
        <Link
          to={`/products/${product.slug}`}
          key={product._id}
          className="group relative border rounded-xl overflow-hidden hover:shadow-xl hover:shadow-red-100/50 transition-all duration-300 hover:-translate-y-1 bg-white"
        >
          {/* Flash Sale Badge - Top Right */}
          <div className="absolute top-2 right-2 z-10">
            <Badge
              variant="destructive"
              className="text-xs font-bold shadow-lg animate-pulse bg-gradient-to-r from-red-500 to-red-600 border-0"
            >
              Flash Sale
            </Badge>
          </div>

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
            <p className="font-medium text-sm line-clamp-2 min-h-[30px] text-gray-800 group-hover:text-gray-900 transition-colors">
              {product.title}
            </p>

            {/* Price Section with Enhanced Styling */}
            <div className="flex items-center gap-2 mb-1">
              <p className="font-bold text-red-600 text-base bg-red-50 px-2 py-1 rounded-md">
                {formatCurrency(product.salePrice)}
              </p>
              <p className="text-muted-foreground line-through text-sm opacity-70">
                {formatCurrency(product.price)}
              </p>
            </div>

            {/* Discount Percentage */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Giảm{" "}
                {Math.round(
                  ((product.price - product.salePrice) / product.price) * 100
                )}
                %
              </span>
              <div className="flex items-center text-yellow-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <span className="text-xs text-gray-600 ml-1">Hot Deal</span>
              </div>
            </div>
          </div>

          {/* Subtle animation border on hover */}
          <div className="absolute inset-0 rounded-xl border-2 border-red-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Link>
      ))}
    </div>
  );
};

export default FlashSaleList;
