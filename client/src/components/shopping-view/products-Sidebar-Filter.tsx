import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchCategoriesForShop } from "@/store/shop/home/category-slice";
import { fetchBrandsForShop } from "@/store/shop/products-slice/brand-slice";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function SidebarFilter() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const categories = useSelector(
    (state: RootState) => state.shopCategory.categories
  );
  const brands = useSelector((state: RootState) => state.shopBrand.brands);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [sort, setSort] = useState<string>("");

  useEffect(() => {
    if (!categories?.length) dispatch(fetchCategoriesForShop());
    if (!brands?.length) dispatch(fetchBrandsForShop());
  }, [categories, brands, dispatch]);

  useEffect(() => {
    setSelectedCategories(searchParams.get("category")?.split(",") || []);
    setSelectedBrands(searchParams.get("brand")?.split(",") || []);
    setPriceMin(searchParams.get("priceMin") || "");
    setPriceMax(searchParams.get("priceMax") || "");
    setSort(searchParams.get("sort") || "");
  }, [searchParams]);

  const updateQuery = useCallback(
    (newParams: Record<string, string | string[] | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          params.delete(key);
        } else {
          params.set(
            key,
            Array.isArray(value) ? value.join(",") : String(value)
          );
        }
      });
      navigate(`${location.pathname}?${params.toString()}`);
    },
    [navigate, location.pathname, searchParams]
  );

  const toggleSelection = (value: string, type: "category" | "brand") => {
    const current = type === "category" ? selectedCategories : selectedBrands;
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    if (type === "category") {
      setSelectedCategories(updated);
      updateQuery({ category: updated, page: "1" });
    } else {
      setSelectedBrands(updated);
      updateQuery({ brand: updated, page: "1" });
    }
  };

  const handlePriceChange = () => {
    updateQuery({
      priceMin: priceMin || undefined,
      priceMax: priceMax || undefined,
      page: "1",
    });
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    updateQuery({ sort: value, page: "1" });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Danh mục</h3>
        <div className="space-y-1">
          {categories?.map((cat) => (
            <div key={cat._id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat._id}`}
                checked={selectedCategories.includes(cat._id)}
                onCheckedChange={() => toggleSelection(cat._id, "category")}
              />
              <Label htmlFor={`cat-${cat._id}`} className="cursor-pointer">
                {cat.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brands */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Thương hiệu</h3>
        <div className="space-y-1">
          {brands?.map((brand) => (
            <div key={brand._id} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand._id}`}
                checked={selectedBrands.includes(brand._id)}
                onCheckedChange={() => toggleSelection(brand._id, "brand")}
              />
              <Label htmlFor={`brand-${brand._id}`} className="cursor-pointer">
                {brand.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Khoảng giá</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Từ"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            type="number"
            className="flex-1"
          />
          <Input
            placeholder="Đến"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            type="number"
            className="flex-1"
          />
        </div>
        <Button
          className="mt-3 w-full"
          variant="outline"
          onClick={handlePriceChange}
        >
          Áp dụng
        </Button>
      </div>

      <Separator />

      {/* Sort */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Sắp xếp</h3>
        <select
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-400"
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="">Mặc định</option>
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá tăng dần</option>
          <option value="price_desc">Giá giảm dần</option>
          <option value="best_selling">Bán chạy</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:block p-4 border rounded-lg bg-white shadow-sm">
        <FilterContent />
      </aside>

      {/* Mobile */}
      <div className="md:hidden mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              Lọc sản phẩm
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Bộ lọc</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
