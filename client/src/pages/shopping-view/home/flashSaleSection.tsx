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
          className="border rounded-xl p-3 hover:shadow transition flex flex-col gap-2"
        >
          <AspectRatio ratio={1 / 1}>
            <img
              src={product.image[0]?.url}
              alt={product.title}
              className="rounded-xl object-cover w-full h-full"
            />
          </AspectRatio>
          <div className="flex flex-col gap-1">
            <p className="font-medium text-sm line-clamp-2 min-h-[40px]">
              {product.title}
            </p>
            <div className="flex items-center gap-2">
              <p className="font-bold text-red-600 text-base">
                {formatCurrency(product.salePrice)}
              </p>
              <p className="text-muted-foreground line-through text-sm">
                {formatCurrency(product.price)}
              </p>
            </div>
            <Badge variant="destructive" className="w-fit text-xs">
              Flash Sale
            </Badge>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FlashSaleList;
