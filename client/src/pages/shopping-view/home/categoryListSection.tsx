import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCategoriesForShop } from "@/store/shop/home/category-slice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading } = useSelector(
    (state: RootState) => state.shopCategory
  );

  useEffect(() => {
    dispatch(fetchCategoriesForShop());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  // Thêm block "Tất cả sản phẩm"
  const categoriesWithAll = [
    {
      _id: "all-products",
      name: "Tất cả sản phẩm",
      slug: "/products",
      image: { url: "/src/assets/all.png" },
    },
    ...categories,
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
      {categoriesWithAll.map((category) => (
        <Link
          to={
            category._id === "all-products"
              ? "/products"
              : `/category/${category.slug}`
          }
          key={category._id}
          className="flex flex-col items-center gap-2 border rounded-xl hover:shadow transition text-center p-2"
        >
          <div className="w-20">
            <AspectRatio ratio={1 / 1}>
              <img
                src={category.image.url}
                alt={category.name}
                className="w-full h-full object-cover rounded-full"
              />
            </AspectRatio>
          </div>
          <p className="text-sm font-medium truncate">{category.name}</p>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
