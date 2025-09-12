import { Button } from "@/components/ui/button";
import { ShoppingCart, Zap } from "lucide-react";

interface ProductActionsProps {
  onAddToCart: () => void;
  onBuyNow: () => void;
  disabled: boolean;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  onAddToCart,
  onBuyNow,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      <Button
        variant="outline"
        size="lg"
        className="flex-1 flex items-center justify-center gap-2 rounded-xl"
        onClick={onAddToCart}
        disabled={disabled}
      >
        <ShoppingCart className="w-5 h-5" />
        Thêm vào giỏ
      </Button>
      <Button
        size="lg"
        className="flex-1 flex items-center justify-center gap-2 rounded-xl"
        onClick={onBuyNow}
        disabled={disabled}
      >
        <Zap className="w-5 h-5" />
        Mua ngay
      </Button>
    </div>
  );
};

export default ProductActions;
