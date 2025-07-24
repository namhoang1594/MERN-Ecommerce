import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItems, updateCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { RootState, AppDispatch } from "../../store/store";
import { CartItem } from "../../store/shop/cart-slice/cart.types";

interface UserCartItemsContentProps {
  cartItem: CartItem;
}

function UserCartItemsContent({ cartItem }: UserCartItemsContentProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const cartData = useSelector((state: RootState) => state.shopCart.cartItems);
  const { productList } = useSelector((state: RootState) => state.shopProducts);

  const dispatch = useDispatch<AppDispatch>();

  async function handleUpdateQuantity(
    getCartItem: CartItem,
    typeOfAction: "plus" | "minus"
  ) {
    if (typeOfAction === "plus") {
      const getCartItems = cartData?.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item: CartItem) => item.productId === getCartItem?.productId
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        const getTotalStock =
          productList[getCurrentProductIndex]?.totalStock ?? 0;

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast.warning(
              `Only ${getQuantity} quantity can be added for this item`
            );
            return;
          }
        }
      }
    }

    const resultAction = await dispatch(
      updateCartItems({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    );

    if (resultAction?.payload?.success) {
      toast.success("Cart item is updated successfully!");
    }
  }

  async function handleCartItemDelete(getCartItem: CartItem) {
    const resultAction = await dispatch(
      deleteCartItems({
        userId: user?.id,
        productId: getCartItem?.productId,
      })
    );

    if (resultAction?.payload?.success) {
      toast.success("Cart item is deleted successfully!");
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-full"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-full"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            ((cartItem?.salePrice ?? 0) > 0
              ? cartItem.salePrice ?? 0
              : cartItem?.price ?? 0) * (cartItem?.quantity ?? 0)
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;
