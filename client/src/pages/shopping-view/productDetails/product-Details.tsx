import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import ProductImageGallery from "./components/product-Details-Image";
import ProductInfo from "./components/product-Details-Info";
import ProductOptions from "./components/product-Details-Options";
import ProductActions from "./components/product-Details-Action";
import ProductDetailsTabs from "./components/product-Details-Tabs";
import RelatedProducts from "./components/product-Details-Related";
import { fetchProductDetail } from "@/store/shop/products-slice/allProducts-slice/productDetails";
import { useParams } from "react-router-dom";

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { data, loading, error } = useSelector(
    (state: RootState) => state.shopProductDetails
  );

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductDetail(slug));
    }
  }, [slug, dispatch]);

  if (loading) return <p className="text-center py-10">Đang tải...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!data?.product)
    return <p className="text-center py-10">Không tìm thấy sản phẩm</p>;

  const { product } = data;

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
          // description={product.description}
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
          onAddToCart={() => console.log("add to cart")}
          onBuyNow={() => console.log("add to cart")}
          disabled={product.totalStock === 0}
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
