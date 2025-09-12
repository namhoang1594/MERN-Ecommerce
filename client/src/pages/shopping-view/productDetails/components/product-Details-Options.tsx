import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import QuantitySelector from "@/components/shopping-view/quantity-selector";

interface ProductOptionsProps {
  sizes?: string[];
  colors?: string[];
  totalStock: number;
}

const ProductOptions: React.FC<ProductOptionsProps> = ({
  sizes = [],
  colors = [],
  totalStock,
}) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const handleQuantityChange = (val: number) => {
    if (val < 1) return;
    if (val > totalStock) return;
    setQuantity(val);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Size */}
      {sizes.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Chọn size</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "rounded-xl px-4",
                  selectedSize === size && "bg-primary text-white"
                )}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Color */}
      {colors.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Chọn màu</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <Button
                key={color}
                variant={selectedColor === color ? "default" : "outline"}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "rounded-xl px-4",
                  selectedColor === color && "bg-primary text-white"
                )}
              >
                {color}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <h3 className="font-medium mb-2">Số lượng</h3>
        <div className="flex items-center gap-2">
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={totalStock}
          />
          <span className="text-sm text-gray-500 ml-2">
            {totalStock} sản phẩm có sẵn
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductOptions;
