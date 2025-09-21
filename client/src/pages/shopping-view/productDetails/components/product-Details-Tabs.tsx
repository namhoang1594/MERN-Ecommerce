import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductDetail } from "@/store/shop/products-slice/allProducts-slice/allProducts.types";
import ReviewForm from "../../reviews-product/reviews-form";
import ReviewList from "../../reviews-product/reviews-list";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type ProductDetailsTabsProps = {
  productId: string;
  description: string;
  currentUser?: { _id: string; name: string };
};

const ProductDetailsTabs: React.FC<ProductDetailsTabsProps> = ({
  productId,
  description,
}) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  console.log("ProductDetailsTabs currentUser:", currentUser);
  return (
    <div className="mt-10">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="flex gap-2 border-b w-full">
          <TabsTrigger value="description" className="flex-1">
            Mô tả chi tiết
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex-1">
            Đánh giá
          </TabsTrigger>
          <TabsTrigger value="policy" className="flex-1">
            Chính sách đổi trả
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="p-4">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </TabsContent>

        <TabsContent value="reviews" className="p-4 space-y-3">
          {currentUser && (
            <ReviewForm
              productId={productId}
              onSuccess={() => console.log("Review success")}
            />
          )}
          <ReviewList productId={productId} currentUserId={currentUser?._id} />
        </TabsContent>

        <TabsContent value="policy" className="p-4">
          <ul className="list-disc pl-5 space-y-2">
            <li>Đổi trả trong vòng 7 ngày kể từ khi nhận hàng.</li>
            <li>Sản phẩm còn nguyên tem, hộp, chưa qua sử dụng.</li>
            <li>Hoàn tiền trong vòng 3-5 ngày làm việc.</li>
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetailsTabs;
