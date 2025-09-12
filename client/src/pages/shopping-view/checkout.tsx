// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/store/store";
// import { Button } from "@/components/ui/button";

// import { fetchAllAddress } from "@/store/shop/address-slice";
// import { Addresses } from "@/store/shop/address-slice/address.types";
// import { CartItem } from "@/store/shop/cart-slice/cart.types";
// import { createNewOrder } from "@/store/shop/order-slice";
// import {
//   CreateOrderPayload,
//   CreateOrderResponse,
// } from "@/store/shop/order-slice/order.types";

// const ShoppingCheckout = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   const cartItems = useSelector((state: RootState) => state.shopCart.cartItems);
//   const { addressList } = useSelector((state: RootState) => state.shopAddress);
//   const { user } = useSelector((state: RootState) => state.auth);
//   const { isLoading, approvalURL } = useSelector(
//     (state: RootState) => state.shopOrder
//   );

//   const userId = user?.id || "";
//   const selectedAddress: Addresses | undefined = addressList[0];

//   const totalAmount = cartItems?.items?.length
//     ? cartItems.items.reduce((total, item: CartItem) => {
//         const price =
//           (item.salePrice ?? 0) > 0 ? item.salePrice ?? 0 : item.price ?? 0;
//         return total + price * item.quantity;
//       }, 0)
//     : 0;

//   const handlePlaceOrder = () => {
//     if (!selectedAddress || cartItems?.items.length === 0) return;

//     const orderData: CreateOrderPayload = {
//       userId,
//       cartId: cartItems?._id,
//       cartItems:
//         cartItems?.items.map((item) => ({
//           productId: item.productId,
//           title: item.title,
//           image: item.image,
//           quantity: item.quantity,
//           price: item.salePrice ?? item.price ?? 0,
//         })) ?? [],
//       addressInfo: {
//         ...selectedAddress,
//         addressId: selectedAddress._id,
//       },
//       totalAmount: totalAmount ?? 0,
//     };

//     dispatch(createNewOrder(orderData))
//       .then((res) => {
//         const payload = res.payload as CreateOrderResponse;
//         if (payload && typeof payload.approvalUrl === "string") {
//           window.location.href = payload.approvalUrl;
//         }
//       })
//       .catch((err) => {
//         console.error("Failed to create order:", err);
//       });
//   };

//   useEffect(() => {
//     if (userId) {
//       dispatch(fetchAllAddress(userId));
//     }
//   }, [dispatch, userId]);

//   console.log("Cart items:", cartItems?.items);

//   return (
//     <div className="max-w-xl mx-auto mt-10 space-y-6">
//       <h2 className="text-2xl font-bold">Checkout</h2>

//       <div className="border p-4 rounded-lg shadow-sm space-y-2">
//         <h3 className="font-semibold text-lg">Shipping Address</h3>
//         {selectedAddress ? (
//           <div className="text-sm leading-6">
//             <p>{selectedAddress.address}</p>
//             <p>{selectedAddress.city}</p>
//             <p>{selectedAddress.phone}</p>
//             <p>{selectedAddress.pincode}</p>
//           </div>
//         ) : (
//           <p className="text-sm text-red-500">No address found.</p>
//         )}
//       </div>

//       <div className="border p-4 rounded-lg shadow-sm space-y-2">
//         <h3 className="font-semibold text-lg">Order Summary</h3>
//         {cartItems && cartItems?.items.length > 0 ? (
//           <>
//             <ul className="text-sm">
//               {cartItems?.items.map((item) => (
//                 <li key={item._id} className="flex justify-between">
//                   <span>
//                     {item.title} x {item.quantity}
//                   </span>
//                   <span>
//                     $
//                     {((item.salePrice ?? 0) > 0
//                       ? item.salePrice ?? 0
//                       : item.price ?? 0) * item.quantity}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//             <div className="font-bold flex justify-between pt-2 border-t">
//               <span>Total:</span>
//               <span>${totalAmount.toFixed(2)}</span>
//             </div>
//           </>
//         ) : (
//           <p className="text-sm text-red-500">Your cart is empty.</p>
//         )}
//       </div>

//       <Button
//         className="w-full"
//         onClick={handlePlaceOrder}
//         disabled={
//           isLoading || !selectedAddress || cartItems?.items.length === 0
//         }
//       >
//         {isLoading ? "Placing Order..." : "Place Order"}
//       </Button>
//     </div>
//   );
// };

// export default ShoppingCheckout;
