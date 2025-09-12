import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import ProductImageGallery from "./components/product-Details-Image";
import ProductInfo from "./components/product-Details-Info";
import ProductOptions from "./components/product-Details-Options";
import ProductActions from "./components/product-Details-Action";
import ProductDetailsTabs from "./components/product-Details-Tabs";
import RelatedProducts from "./components/product-Details-Related";
import { fetchProductDetail } from "@/store/shop/products-slice/allProducts-slice/productDetails";
import { useNavigate, useParams } from "react-router-dom";
import { addToCart, addToLocalCart } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { Product } from "@/store/admin/products-slice/product.types";
import { Loader2 } from "lucide-react";

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.shopProductDetails
  );
  const { isLoggedIn } = useSelector((state: RootState) => state.shopCart);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductDetail(slug));
    }
  }, [slug, dispatch]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Đang tải sản phẩm...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 text-blue-500 hover:underline"
        >
          Quay lại
        </button>
      </div>
    );
  }

  if (!data?.product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg">Không tìm thấy sản phẩm</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 text-blue-500 hover:underline"
        >
          Xem tất cả sản phẩm
        </button>
      </div>
    );
  }

  const { product } = data;

  const isOutOfStock = product.totalStock === 0;

  const handleAddToCart = async (quantity: number) => {
    if (isOutOfStock) return;
    try {
      if (isLoggedIn) {
        await dispatch(
          addToCart({
            productId: product._id,
            quantity,
          })
        ).unwrap();

        toast.success("Đã thêm vào giỏ hàng!");
      } else {
        dispatch(
          addToLocalCart({
            productId: product._id,
            quantity,
            product: {
              title: product.title,
              image: product.image,
              price: product.price,
              salePrice: product.salePrice,
              totalStock: product.totalStock,
            },
          })
        );

        toast.success("Đã thêm vào giỏ hàng!");
      }
    } catch (error: any) {
      console.error("Add to cart error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  const handleBuyNow = async (quantity: number) => {
    if (isOutOfStock) return;
    try {
      if (isLoggedIn) {
        await dispatch(
          addToCart({
            productId: product._id,
            quantity,
          })
        ).unwrap();
      } else {
        dispatch(
          addToLocalCart({
            productId: product._id,
            quantity,
            product: {
              title: product.title,
              image: product.image,
              price: product.price,
              salePrice: product.salePrice,
              totalStock: product.totalStock,
            },
          })
        );
      }

      navigate("/checkout");
    } catch (error: any) {
      console.error("Buy now error:", error);
      toast.error(error.message || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Images */}
      <ProductImageGallery image={product.image} />

      {/* Right: Info */}
      <div className="flex flex-col gap-6">
        <ProductInfo
          title={product.title}
          price={product.price}
          salePrice={product.salePrice}
          brand={product.brand}
          category={product.category}
          totalStock={product.totalStock}
        />
        <ProductOptions
          sizes={["S", "M", "L", "XL"]}
          colors={["Đỏ", "Xanh", "Vàng"]}
          totalStock={product.totalStock}
        />
        <ProductActions
          onAddToCart={() => handleAddToCart(quantity)}
          onBuyNow={() => handleBuyNow(quantity)}
          disabled={isOutOfStock}
          // loading={isAddingToCart}
          // quantity={quantity}
        />
      </div>

      {/* Full width below */}
      <div className="lg:col-span-2 mt-10">
        <ProductDetailsTabs description={product.description} />
      </div>

      <div className="lg:col-span-2 mt-10">
        <RelatedProducts />
      </div>
    </div>
  );
};

export default ProductDetailPage;
