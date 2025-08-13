import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { ProductTableProps } from "@/store/admin/products-slice/product.types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { formatCurrency } from "@/lib/utils";
import {
  toggleFlashSaleStatus,
  toggleProductStatus,
} from "@/store/admin/products-slice";

export const ProductTable = ({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const renderImage = (src: string, alt?: string) => (
    <img
      src={src}
      alt={alt || "product"}
      className="w-16 h-16 object-cover rounded-md border"
    />
  );

  const renderPrice = (price: number, salePrice?: number) => {
    if (salePrice)
      return (
        <>
          <span className="line-through text-sm text-muted-foreground mr-1">
            {formatCurrency(price)}
          </span>
          <span className="text-red-500 font-semibold">
            {formatCurrency(salePrice)}
          </span>
        </>
      );
    return <>{formatCurrency(price)}</>;
  };

  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="min-w-full table-auto text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="p-3 text-left">Ảnh</th>
            <th className="p-3 text-left">Tên sản phẩm</th>
            <th className="p-3 text-left">Brand</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Giá</th>
            <th className="p-3 text-left">Kho</th>
            <th className="p-3 text-left">Hiển thị</th>
            <th className="p-3 text-left">Flash sale</th>
            <th className="p-3 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-b hover:bg-muted/40">
              <td className="p-3">
                {Array.isArray(product.image) && product.image.length > 0
                  ? renderImage(product.image[0].url)
                  : "Không có ảnh"}
              </td>
              <td className="p-3 font-medium">{product.title}</td>
              <td className="p-3">{product.brand?.name || "—"}</td>
              <td className="p-3">{product.category?.name || "—"}</td>
              <td className="p-3">
                {renderPrice(product.price, product.salePrice)}
              </td>
              <td className="p-3">{product.totalStock}</td>
              <td className="p-3 items-center gap-2">
                <Switch
                  checked={product.active}
                  onCheckedChange={() =>
                    dispatch(toggleProductStatus(product._id))
                  }
                />
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    product.active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.active ? "Hiển thị" : "Ẩn"}
                </span>
              </td>
              <td className="p-3 items-center gap-2">
                <Switch
                  checked={product.isFlashSale}
                  onCheckedChange={() =>
                    dispatch(toggleFlashSaleStatus(product._id))
                  }
                />
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    product.isFlashSale
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.isFlashSale ? "Flash sale" : "Không"}
                </span>
              </td>
              <td className="p-3 text-center space-x-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onEdit(product)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => onDelete(product)}
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
