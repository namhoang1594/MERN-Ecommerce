import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductDetail } from "@/store/shop/products-slice/allProducts-slice/allProducts.types";

type ProductInfoProps = Pick<ProductDetail, "description">;

const ProductDetailsTabs: React.FC<ProductInfoProps> = ({ description }) => {
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
          {/* Mock reviews */}
          <div className="border rounded-xl p-3 shadow-sm">
            <p className="font-semibold">Nguyễn Văn A</p>
            <p className="text-sm text-gray-500">⭐ 5/5</p>
            <p className="mt-2">Sản phẩm rất tốt, giao hàng nhanh.</p>
          </div>
          <div className="border rounded-xl p-3 shadow-sm">
            <p className="font-semibold">Trần Thị B</p>
            <p className="text-sm text-gray-500">⭐ 4/5</p>
            <p className="mt-2">Hàng ổn, nhưng đóng gói chưa đẹp lắm.</p>
          </div>
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
