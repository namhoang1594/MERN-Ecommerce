import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchNewArrivalsForShop } from "@/store/shop/home/newArrivalProduct-slice";

const NewArrivalSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector(
    (state: RootState) => state.shopNewArrivalProduct
  );

  useEffect(() => {
    dispatch(fetchNewArrivalsForShop());
  }, [dispatch]);

  return (
    <section className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🆕 Hàng mới về</h2>
        <a href="/products" className="text-sm text-blue-500 hover:underline">
          Xem tất cả
        </a>
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
              className="border rounded-xl p-4 flex flex-col items-center hover:shadow transition"
            >
              <img
                src={p.image[0]?.url}
                alt={p.title}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
              <h3 className="font-medium text-sm text-center">{p.title}</h3>
              <p className="text-red-500 font-semibold">
                {p.salePrice || p.price}₫
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default NewArrivalSection;
