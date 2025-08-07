import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";

import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import {
  ProductFormProps,
  ProductFormState,
  ProductImage,
} from "@/store/admin/products-slice/product.types";
import { toast } from "sonner";
import { MultipleImageUpload } from "@/components/common/mutilpleImage-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState: ProductFormState = {
  title: "",
  description: "",
  price: 0,
  salePrice: 0,
  totalStock: 0,
  image: [],
  brand: "",
  category: "",
  active: true,
  deletedImages: [],
};

export const ProductFormModal = ({
  open,
  onClose,
  onSubmit,
  isEdit,
  initialData,
  brands,
  categories,
}: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormState>(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(isEdit && initialData ? initialData : initialState);
  }, [isEdit, initialData]);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: ["price", "salePrice", "totalStock"].includes(name)
          ? Number(value)
          : value,
      }));
    },
    []
  );

  const handleSwitch = useCallback((value: boolean) => {
    setFormData((prev) => ({ ...prev, active: value }));
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit(formData);
      onClose();
    } catch {
      toast.error("Lỗi khi lưu sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Tên sản phẩm */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Tên sản phẩm</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Nhập tên sản phẩm"
            />
          </div>

          {/* Giá */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price">Giá</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          {/* Mô tả (full width) */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả sản phẩm"
            />
          </div>

          {/* Giá khuyến mãi */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="salePrice">Giá khuyến mãi</Label>
            <Input
              id="salePrice"
              name="salePrice"
              type="number"
              value={formData.salePrice}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          {/* Kho */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="totalStock">Số lượng trong kho</Label>
            <Input
              id="totalStock"
              name="totalStock"
              type="number"
              value={formData.totalStock}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          {/* Select Thương hiệu */}
          <div className="flex flex-col gap-1.5">
            <Label>Thương hiệu</Label>
            <Select
              value={formData.brand}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, brand: value }))
              }
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Chọn thương hiệu" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand._id} value={brand._id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Select Danh mục */}
          <div className="flex flex-col gap-1.5">
            <Label>Danh mục</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Upload hình ảnh (full width) */}
          <div className="col-span-2">
            <MultipleImageUpload
              label="Hình ảnh sản phẩm"
              value={formData.image}
              onChange={(newImages, removedImages) => {
                setFormData((prev) => ({
                  ...prev,
                  image: newImages,
                  deletedImages: Array.from(
                    new Set([
                      ...(prev.deletedImages || []),
                      ...removedImages.map((img) => img.public_id),
                    ])
                  ),
                }));
              }}
              uploadApiUrl="http://localhost:5000/api/upload-image"
              uploadFolder="products"
            />
          </div>

          {/* Switch & Submit (full width) */}
          <div className="col-span-2 flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              <Switch
                checked={formData.active}
                onCheckedChange={handleSwitch}
              />
              <Label>Hiển thị sản phẩm</Label>
            </div>
            <Button disabled={loading} onClick={handleSubmit}>
              {isEdit ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
