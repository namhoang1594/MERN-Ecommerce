import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { CartItem } from "../../store/shop/cart-slice/cart.types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";

interface UserCartWrapperProps {
  setOpenCartSheet: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: CartItem[];
}

const UserCartWrapper: React.FC<UserCartWrapperProps> = ({
  cartItems,
  setOpenCartSheet,
}) => {
  const navigate = useNavigate();
  // const cartItems = useSelector((state: RootState) => state.shopCart.cartItems);
  const [forceUpdate, setForceUpdate] = useState(0);

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce((sum, item) => {
          const price =
            item.salePrice && item.salePrice > 0
              ? item.salePrice
              : item.price || 0;
          return sum + price * item.quantity;
        }, 0)
      : 0;

  useEffect(() => {
    console.log("🟢 cartItems changed:", cartItems);
  }, [cartItems]);

  useEffect(() => {
    setForceUpdate((prev) => prev + 1);
  }, [cartItems]);

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>

      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0
          ? cartItems.map((item, index) => {
              return (
                <UserCartItemsContent
                  key={item.productId || index}
                  cartItem={item}
                />
              );
            })
          : null}
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalCartAmount.toFixed(2)}</span>
        </div>
      </div>

      <Button
        className="w-full mt-6"
        onClick={() => {
          navigate("/checkout");
          setOpenCartSheet(false);
        }}
      >
        Checkout
      </Button>
    </SheetContent>
  );
};

export default UserCartWrapper;
