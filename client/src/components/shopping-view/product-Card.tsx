import { FC } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { ProductCardProps } from "@/store/shop/products-slice/allProducts-slice/allProducts.types";
import { AspectRatio } from "../ui/aspect-ratio";

const ProductCard: FC<ProductCardProps> = ({
  _id,
  slug,
  title,
  image,
  category,
  brand,
  price,
  salePrice,
  onAddToCart,
}) => {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition py-0 gap-4">
      <Link to={`/products/${slug}`}>
        <div className="relative w-full">
          <AspectRatio ratio={1 / 1}>
            <img
              src={image[0].url}
              alt={title}
              className="object-cover w-full h-full rounded-t-lg"
            />
          </AspectRatio>
        </div>
      </Link>

      <CardContent className="space-y-2 px-4 pb-4 pt-0">
        <Link to={`/products/${slug}`}>
          <h3 className="font-medium text-base line-clamp-2">{title}</h3>
        </Link>

        <p className="text-sm text-muted-foreground">
          {category.name} • {brand.name}
        </p>

        <div className="flex items-center gap-2">
          {salePrice ? (
            <>
              <span className="text-red-500 font-semibold">
                {salePrice.toLocaleString()}₫
              </span>
              <span className="text-sm text-gray-400 line-through">
                {price.toLocaleString()}₫
              </span>
            </>
          ) : (
            <span className="font-semibold">{price.toLocaleString()}₫</span>
          )}
        </div>

        <Button
          className="w-full mt-2"
          variant="default"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(_id);
          }}
        >
          <ShoppingCart className="w-4 h-4 mr-1" />
          Thêm vào giỏ hàng
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
