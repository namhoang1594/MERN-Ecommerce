import { Button } from "@/components/ui/button";
import {
  BabyIcon,
  BriefcaseBusiness,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Footprints,
  GlassesIcon,
  ShirtIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { RootState, AppDispatch } from "@/store/store";
import { Product } from "@/types/products/product.types";
import { FeatureImage } from "@/store/common-slice/common.types";

interface CategoryItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const categoriesWithIcons: CategoryItem[] = [
  { id: "man", label: "Man", icon: ShirtIcon },
  { id: "woman", label: "Woman", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: GlassesIcon },
  { id: "footwear", label: "Footwear", icon: Footprints },
];

const brandWithIcons: CategoryItem[] = [
  { id: "nike", label: "Nike", icon: Footprints },
  { id: "adidas", label: "Adidas", icon: Footprints },
  { id: "gucci", label: "Gucci", icon: GlassesIcon },
  { id: "dior", label: "Dior", icon: BriefcaseBusiness },
  { id: "h&m", label: "H&M", icon: BriefcaseBusiness },
];

function ShoppingHome() {
  const autoPlay = true;
  const interval = 5000;
  const showArrows = true;
  const showDots = true;

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { productList, productDetails } = useSelector(
    (state: RootState) => state.shopProducts
  );
  const { featureImageList } = useSelector(
    (state: RootState) => state.commonFeature
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, featureImageList.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  function handleNavigateToListingPage(
    getCurrentItem: CategoryItem,
    section: string
  ) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId: string) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId: string) {
    if (!user?.id) return;
    dispatch(
      addToCart({
        userId: user.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user.id));
        toast.success("Product is added to cart!");
      }
    });
  }

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList &&
          featureImageList.map((slide: FeatureImage, index: number) => (
            <img
              src={slide?.image}
              key={index}
              className={`$${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out`}
            />
          ))}

        {showArrows && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 z-20"
              onClick={() =>
                setCurrentSlide(
                  (prevSlide) =>
                    (prevSlide - 1 + featureImageList.length) %
                    featureImageList.length
                )
              }
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 z-20"
              onClick={() =>
                setCurrentSlide(
                  (prevSlide) => (prevSlide + 1) % featureImageList.length
                )
              }
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </>
        )}

        {showDots && (
          <div className="absolute bottom-6 w-full flex justify-center space-x-2 z-20">
            {featureImageList.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 $${
                  index === currentSlide ? "bg-primary" : "bg-gray-300"
                }`}
                onClick={() => goToSlide(index)}
              ></button>
            ))}
          </div>
        )}
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcons.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {brandWithIcons.map((brandItem) => (
              <Card
                key={brandItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList &&
              productList.map((productItem: Product) => (
                <ShoppingProductTile
                  key={productItem._id}
                  product={productItem}
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddtoCart={handleAddtoCart}
                />
              ))}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
