import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ProductCard from "@/components/shopping-view/product-Card";

export default function RelatedProducts() {
  const { data, loading } = useSelector(
    (state: RootState) => state.shopProductDetails
  );

  const relatedProducts = data?.relatedProducts || [];

  const handleAddToCart = (id: string) => {
    console.log("Add to cart:", id);
  };

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-4">Sản phẩm liên quan</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : relatedProducts.length === 0 ? (
        <p>Không có sản phẩm liên quan.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {relatedProducts.map((product) => (
            <ProductCard
              key={product._id}
              _id={product._id}
              slug={product.slug}
              title={product.title}
              image={product.image}
              category={product.category}
              brand={product.brand}
              price={product.price}
              salePrice={product.salePrice}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
