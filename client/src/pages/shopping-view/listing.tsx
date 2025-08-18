// import ProductFilter from "@/components/shopping-view/filter";
// import ProductDetailsDialog from "@/components/shopping-view/product-details";
// import ShoppingProductTile from "@/components/shopping-view/product-tile";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { sortOptions } from "@/config";
// import { setUser } from "@/store/auth-slice";
// import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// import {
//   fetchAllFilteredProducts,
//   fetchProductDetails,
// } from "@/store/shop/products-slice";
// import { ArrowUpDownIcon } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useSearchParams } from "react-router-dom";
// import { toast } from "sonner";
// import { RootState, AppDispatch } from "@/store/store";
// import { Product } from "@/types/products/product.types";

// function createSearchParamsHelper(
//   filterParams: Record<string, string[]>
// ): string {
//   const queryParams: string[] = [];
//   for (const [key, value] of Object.entries(filterParams)) {
//     if (Array.isArray(value) && value.length > 0) {
//       const paramValue = value.join(",");
//       queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
//     }
//   }
//   return queryParams.join("&");
// }

// function ShoppingListing() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { productList, productDetails } = useSelector(
//     (state: RootState) => state.shopProducts
//   );
//   const { cartItems } = useSelector((state: RootState) => state.shopCart);
//   const { user } = useSelector((state: RootState) => state.auth);
//   const [filters, setFilters] = useState<Record<string, string[]>>({});
//   const [sortBy, setSortBy] = useState<string | null>(null);
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);

//   const categorySearchParams = searchParams.get("category");

//   function handleSortBy(value: string) {
//     setSortBy(value);
//   }

//   function handleFilters(getSectionId: string, getCurrentOption: string) {
//     let cpyFilters = { ...filters };
//     const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);
//     if (indexOfCurrentSection === -1) {
//       cpyFilters = {
//         ...cpyFilters,
//         [getSectionId]: [getCurrentOption],
//       };
//     } else {
//       const indexOfCurrentOption =
//         cpyFilters[getSectionId].indexOf(getCurrentOption);
//       if (indexOfCurrentOption === -1)
//         cpyFilters[getSectionId].push(getCurrentOption);
//       else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
//     }
//     setFilters(cpyFilters);
//     sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
//   }

//   function handleGetProductDetails(getCurrentProductId: string) {
//     dispatch(fetchProductDetails(getCurrentProductId));
//   }

//   function handleAddtoCart(getCurrentProductId: string, getTotalStock: number) {
//     const getCartItems = cartItems || [];
//     if (getCartItems.length) {
//       const indexOfCurrentItem = getCartItems.findIndex(
//         (item) => item.productId === getCurrentProductId
//       );
//       if (indexOfCurrentItem > -1) {
//         const getQuantity = getCartItems[indexOfCurrentItem].quantity;
//         if (getQuantity + 1 > getTotalStock) {
//           toast.warning(
//             `Only ${getQuantity} quantity can be added for this item`
//           );
//           return;
//         }
//       }
//     }
//     dispatch(
//       addToCart({
//         userId: user?.id,
//         productId: getCurrentProductId,
//         quantity: 1,
//       })
//     ).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(fetchCartItems(user?.id));
//         toast.success("Product is added to cart!");
//       }
//     });
//   }

//   useEffect(() => {
//     setSortBy("price-lowtohigh");
//     setFilters(JSON.parse(sessionStorage.getItem("filters") || "{}"));
//   }, [categorySearchParams]);

//   useEffect(() => {
//     if (filters && Object.keys(filters).length > 0) {
//       const createQueryString = createSearchParamsHelper(filters);
//       setSearchParams(new URLSearchParams(createQueryString));
//     }
//   }, [filters]);

//   useEffect(() => {
//     if (filters !== null && sortBy !== null)
//       dispatch(
//         fetchAllFilteredProducts({ filterParams: filters, sortParams: sortBy })
//       );
//   }, [dispatch, sortBy, filters]);

//   useEffect(() => {
//     if (productDetails !== null) setOpenDetailsDialog(true);
//   }, [productDetails]);

//   useEffect(() => {
//     if (!user) {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         dispatch(setUser(JSON.parse(storedUser)));
//       }
//     }
//   }, [dispatch, user]);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
//       <ProductFilter filters={filters} handleFilters={handleFilters} />
//       <div className="bg-background w-full rounded-lg shadow-sm">
//         <div className="p-4 border-b flex items-center justify-between">
//           <h2 className="text-lg font-extrabold ">All Product</h2>
//           <div className="flex items-center gap-3">
//             <span className="text-muted-foreground">
//               {productList.length} Products
//             </span>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="flex items-center gap-1"
//                 >
//                   <ArrowUpDownIcon className="h-4 w-4" />
//                   <span>Sort by</span>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-[200px]">
//                 <DropdownMenuRadioGroup
//                   value={sortBy || undefined}
//                   onValueChange={handleSortBy}
//                 >
//                   {sortOptions.map((sortItem) => (
//                     <DropdownMenuRadioItem
//                       key={sortItem.id}
//                       value={sortItem.id}
//                     >
//                       {sortItem.label}
//                     </DropdownMenuRadioItem>
//                   ))}
//                 </DropdownMenuRadioGroup>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
//           {productList && productList.length > 0
//             ? productList.map((productItem: Product) => (
//                 <ShoppingProductTile
//                   key={productItem._id}
//                   product={productItem}
//                   handleGetProductDetails={handleGetProductDetails}
//                   handleAddtoCart={handleAddtoCart}
//                 />
//               ))
//             : null}
//         </div>
//       </div>
//       <ProductDetailsDialog
//         open={openDetailsDialog}
//         setOpen={setOpenDetailsDialog}
//         productDetails={productDetails}
//       />
//     </div>
//   );
// }

// export default ShoppingListing;
