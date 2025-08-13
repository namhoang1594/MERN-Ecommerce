import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { fetchSuggestionProductsForShop } from "@/store/shop/home/suggestionProduct-slice";

const SuggestionProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector(
    (state: RootState) => state.shopSuggestionProduct
  );

  useEffect(() => {
    dispatch(fetchSuggestionProductsForShop());
  }, [dispatch]);

  return (
    <section className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🎯 Gợi ý hôm nay</h2>
        <Link to="/products" className="text-sm text-blue-500 hover:underline">
          Xem tất cả
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {products.map((p) => (
            <div
              key={p._id}
              className="border rounded-xl overflow-hidden hover:shadow transition flex flex-col"
            >
              <img
                src={p.image[0]?.url}
                alt={p.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-2 flex flex-col flex-1">
                <h3 className="text-sm font-medium flex-1 line-clamp-2">
                  {p.title}
                </h3>
                <p className="text-red-500 font-bold mt-1">
                  {p.salePrice
                    ? p.salePrice.toLocaleString() + "₫"
                    : p.price.toLocaleString() + "₫"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SuggestionProducts;
