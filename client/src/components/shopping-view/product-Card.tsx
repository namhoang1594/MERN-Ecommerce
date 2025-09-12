import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart } from "lucide-react";
import { ProductCardProps } from "@/store/shop/products-slice/allProducts-slice/allProducts.types";
import { AspectRatio } from "../ui/aspect-ratio";
import QuantitySelector from "./quantity-selector";
import { addToCart, addToLocalCart } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { Badge } from "../ui/badge";

const ProductCard: FC<ProductCardProps> = ({
  _id,
  slug,
  title,
  image,
  category,
  brand,
  price,
  salePrice,
  totalStock = 0,
  onAddToCart,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn, loading } = useSelector(
    (state: RootState) => state.shopCart
  );
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = totalStock === 0;

  const discountPercent = salePrice
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;

  const categoryName =
    typeof category === "string" ? category : category?.name || "";
  const brandName = typeof brand === "string" ? brand : brand?.name || "";

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isOutOfStock) return;

    try {
      if (isLoggedIn) {
        await dispatch(
          addToCart({
            productId: _id,
            quantity,
          })
        ).unwrap();
        toast.success("Đã thêm vào giỏ hàng!");
      } else {
        dispatch(
          addToLocalCart({
            productId: _id,
            quantity,
            product: {
              title,
              image,
              price,
              salePrice,
              totalStock,
            },
          })
        );

        toast.success("Đã thêm vào giỏ hàng!");
      }

      // Call parent callback if provided
      if (onAddToCart) {
        onAddToCart(_id, quantity);
      }
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden">
      <Link to={`/products/${slug}`}>
        <div className="relative w-full">
          <AspectRatio ratio={1 / 1}>
            <img
              src={image[0]?.url || "/placeholder.png"}
              alt={title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
            />
          </AspectRatio>

          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discountPercent > 0 && (
              <Badge variant="destructive" className="text-xs">
                -{discountPercent}%
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="secondary" className="text-xs">
                Hết hàng
              </Badge>
            )}
          </div>
        </div>
      </Link>

      <CardContent className="space-y-3 px-4 pb-4 pt-3">
        <Link to={`/products/${slug}`}>
          <h3 className="font-medium text-base line-clamp-2 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        {(categoryName || brandName) && (
          <p className="text-sm text-muted-foreground">
            {[categoryName, brandName].filter(Boolean).join(" • ")}
          </p>
        )}

        <div className="flex items-center gap-2">
          {salePrice ? (
            <>
              <span className="text-red-500 font-bold text-lg">
                {salePrice.toLocaleString()}₫
              </span>
              <span className="text-sm text-gray-400 line-through">
                {price.toLocaleString()}₫
              </span>
            </>
          ) : (
            <span className="font-bold text-lg">{price.toLocaleString()}₫</span>
          )}
        </div>

        {totalStock > 0 && (
          <p className="text-xs text-gray-500">Còn {totalStock} sản phẩm</p>
        )}

        {/*Quantity selector - only show if not out of stock */}
        {!isOutOfStock && (
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={totalStock}
            size="sm"
            disabled={totalStock === 0}
          />
        )}

        {/*Add to cart button with loading state */}
        <Button
          className="w-full"
          variant="default"
          size="sm"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          {totalStock === 0 ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang thêm...
            </>
          ) : isOutOfStock ? (
            "Hết hàng"
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Thêm vào giỏ hàng
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
