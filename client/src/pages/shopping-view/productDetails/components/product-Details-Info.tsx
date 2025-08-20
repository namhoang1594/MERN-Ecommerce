import { Badge } from "@/components/ui/badge";
import {
  ProductDetail,
  ProductDetailResponse,
} from "@/store/shop/products-slice/allProducts-slice/allProducts.types";
import { Star } from "lucide-react";
import React from "react";

type ProductInfoProps = Pick<
  ProductDetail,
  | "title"
  | "price"
  | "salePrice"
  // | "description"
  | "brand"
  | "category"
  | "totalStock"
>;

const ProductInfo: React.FC<ProductInfoProps> = ({
  title,
  price,
  salePrice,
  // description,
  brand,
  category,
  totalStock,
}) => {
  // mock tạm rating
  const rating = 4.3;
  const totalReviews = 128;

  return (
    <div className="flex flex-col gap-4">
      {/* Tên sản phẩm */}
      <h1 className="text-2xl font-bold">{title}</h1>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={18}
              className={
                i < Math.round(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">
          {rating.toFixed(1)} ({totalReviews} đánh giá)
        </span>
      </div>

      {/* Giá */}
      <div className="flex items-center gap-3">
        {salePrice ? (
          <>
            <span className="text-xl font-semibold text-red-500">
              {salePrice.toLocaleString()}₫
            </span>
            <span className="text-gray-400 line-through">
              {price.toLocaleString()}₫
            </span>
          </>
        ) : (
          <span className="text-xl font-semibold">
            {price.toLocaleString()}₫
          </span>
        )}
      </div>

      {/* Mô tả ngắn */}
      {/* {description && <p className="text-gray-600">{description}</p>} */}

      {/* Brand & Category */}
      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
        {brand && (
          <span>
            Thương hiệu:{" "}
            <Badge variant="outline" className="ml-1">
              {brand.name}
            </Badge>
          </span>
        )}
        {category && (
          <span>
            Danh mục:{" "}
            <Badge variant="outline" className="ml-1">
              {category.name}
            </Badge>
          </span>
        )}
      </div>

      {/* Trạng thái */}
      <div>
        {totalStock && totalStock > 0 ? (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            Còn hàng
          </Badge>
        ) : (
          <Badge className="bg-red-500 hover:bg-red-600">Hết hàng</Badge>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
