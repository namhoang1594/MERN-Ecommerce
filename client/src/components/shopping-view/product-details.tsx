// import { StarIcon } from "lucide-react";
// import { Avatar, AvatarFallback } from "../ui/avatar";
// import { Button } from "../ui/button";
// import { Dialog, DialogContent } from "../ui/dialog";
// import { Separator } from "../ui/separator";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import StarRatingComponent from "../common/star-rating";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/store/store";
// import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// import { toast } from "sonner";
// import { setProductDetails } from "@/store/shop/products-slice";
// import { addReview, getReview } from "@/store/shop/review-product-slice";
// import { useEffect, useState } from "react";
// import { Product } from "../../types/products/product.types";
// import { CartItem } from "../../store/shop/cart-slice/cart.types";

// interface ProductDetailsDialogProps {
//   open: boolean;
//   setOpen: (open: boolean) => void;
//   productDetails: Product | null;
// }

// function ProductDetailsDialog({
//   open,
//   setOpen,
//   productDetails,
// }: ProductDetailsDialogProps) {
//   const [reviewMessage, setReviewMessage] = useState<string>("");
//   const [rating, setRating] = useState<number>(0);

//   const dispatch = useDispatch<AppDispatch>();
//   const { user } = useSelector((state: RootState) => state.auth);
//   const cartData = useSelector((state: RootState) => state.shopCart.cartItems);
//   const { reviews } = useSelector(
//     (state: RootState) => state.shopReviewProduct
//   );

//   function handleAddToCart(productId: string, totalStock: number) {
//     const currentCart = cartData?.items || [];
//     const index = currentCart.findIndex(
//       (item: CartItem) => item.productId === productId
//     );

//     if (index > -1) {
//       const quantity = currentCart[index].quantity;
//       if (quantity + 1 > totalStock) {
//         toast.warning(`Only ${quantity} quantity can be added for this item`);
//         return;
//       }
//     }

//     dispatch(
//       addToCart({
//         userId: user?.id,
//         productId,
//         quantity: 1,
//       })
//     ).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(fetchCartItems(user?.id));
//         toast.success("Product is added to cart!");
//       }
//     });
//   }

//   function handleDialogClose() {
//     setOpen(false);
//     dispatch(setProductDetails());
//     setRating(0);
//     setReviewMessage("");
//   }

//   function handleChangeRating(newRating: number) {
//     setRating(newRating);
//   }

//   function handleAddReview() {
//     if (!productDetails || !user) return;

//     dispatch(
//       addReview({
//         productId: productDetails._id,
//         userId: user.id,
//         userName: user.userName,
//         reviewMessage,
//         reviewValue: rating,
//       })
//     ).then((data) => {
//       if (data.payload) {
//         setRating(0);
//         setReviewMessage("");
//         dispatch(getReview(productDetails._id));
//         toast.success("Review added successfully!");
//       }
//     });
//   }

//   useEffect(() => {
//     if (productDetails !== null) {
//       dispatch(getReview(productDetails._id));
//     }
//   }, [productDetails]);

//   const averageReview =
//     reviews && reviews.length > 0
//       ? reviews.reduce((sum, r) => sum + r.reviewValue, 0) / reviews.length
//       : 0;

//   return (
//     <Dialog open={open} onOpenChange={handleDialogClose}>
//       <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
//         <div className="relative overflow-hidden rounded-lg">
//           <img
//             src={productDetails?.image}
//             alt={productDetails?.title}
//             width={600}
//             height={600}
//             className="aspect-square w-full object-cover"
//           />
//         </div>
//         <div>
//           <div>
//             <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
//             <p className="text-muted-foreground text-2xl mb-5 mt-4">
//               {productDetails?.description}
//             </p>
//           </div>
//           <div className="flex items-center justify-between">
//             {productDetails && (
//               <p
//                 className={`text-3xl font-bold text-primary ${
//                   productDetails?.salePrice > 0 ? "line-through" : ""
//                 }`}
//               >
//                 ${productDetails?.price}
//               </p>
//             )}
//             {productDetails && productDetails?.salePrice > 0 && (
//               <p className="text-2xl font-bold text-muted-foreground">
//                 ${productDetails.salePrice}
//               </p>
//             )}
//           </div>
//           <div className="flex items-center gap-2 mt-2">
//             <div className="flex items-center gap-0.5">
//               <StarRatingComponent rating={averageReview} />
//             </div>
//             <span className="text-muted-foreground">
//               ({averageReview.toFixed(2)})
//             </span>
//           </div>
//           <div className="mt-5 mb-5">
//             {productDetails?.totalStock === 0 ? (
//               <Button className="w-full opacity-60 cursor-not-allowed">
//                 Out Of Stock
//               </Button>
//             ) : (
//               productDetails && (
//                 <Button
//                   className="w-full"
//                   onClick={() =>
//                     handleAddToCart(
//                       productDetails._id,
//                       productDetails.totalStock
//                     )
//                   }
//                 >
//                   Add to Cart
//                 </Button>
//               )
//             )}
//           </div>
//           <Separator />
//           <div className="max-h-[300px] overflow-auto">
//             <h2 className="text-xl font-bold mb-4">Reviews</h2>
//             <div className="grid gap-6">
//               {reviews && reviews.length > 0 ? (
//                 reviews.map((reviewItem: any, index: number) => (
//                   <div key={index} className="flex gap-4">
//                     <Avatar className="w-10 h-10 border">
//                       <AvatarFallback>
//                         {reviewItem?.userName?.[0]?.toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="grid gap-1">
//                       <div className="flex items-center gap-2">
//                         <h3 className="font-bold">{reviewItem?.userName}</h3>
//                       </div>
//                       <div className="flex items-center gap-0.5">
//                         <StarRatingComponent rating={reviewItem?.reviewValue} />
//                       </div>
//                       <p className="text-muted-foreground">
//                         {reviewItem.reviewMessage}
//                       </p>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <h1>No Reviews</h1>
//               )}
//             </div>
//             <div className="mt-10 flex flex-col gap-2">
//               <Label>Write a review</Label>
//               <div className="flex gap-1">
//                 <StarRatingComponent
//                   rating={rating}
//                   handleChangeRating={handleChangeRating}
//                 />
//               </div>
//               <Input
//                 name="reviewMessage"
//                 value={reviewMessage}
//                 onChange={(e) => setReviewMessage(e.target.value)}
//                 placeholder="Write a review...."
//               />
//               <Button
//                 onClick={handleAddReview}
//                 disabled={reviewMessage.trim() === ""}
//               >
//                 Submit
//               </Button>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default ProductDetailsDialog;
