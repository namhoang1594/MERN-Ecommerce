import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  addProduct,
  deleteProduct,
  fetchAllProducts,
  updateProduct,
} from "@/store/admin/products-slice";
import { ProductTable } from "./productTable";
import { ProductFormModal } from "./productFormModal";
import { Pagination } from "@/components/common/pagination";
import {
  Product,
  ProductFormState,
} from "@/store/admin/products-slice/product.types";
import { toast } from "sonner";
import ConfirmModal from "@/components/common/confirm-modal";
import {
  convertProductToFormState,
  convertToPlainProduct,
} from "./convertFormData";
import { fetchAllBrands } from "@/store/admin/brand-slice";
import { fetchAllCategory } from "@/store/admin/category-slice";

const LIMIT = 10;

export default function ProductPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, totalPages, loading } = useSelector(
    (state: RootState) => state.adminProducts
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedProductToDelete, setSelectedProductToDelete] =
    useState<Product | null>(null);
  const brands = useSelector((state: RootState) => state.adminBrand.brandList);
  const categories = useSelector(
    (state: RootState) => state.adminCategory.categoryList
  );

  useEffect(() => {
    dispatch(fetchAllBrands());
    dispatch(fetchAllCategory());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchAllProducts({
        page: currentPage,
        limit: LIMIT,
        search: searchTerm.trim(),
      })
    );
  }, [dispatch, currentPage, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCreateOrUpdateProduct = async (data: ProductFormState) => {
    try {
      setOpenModal(false);
      if (selectedProduct) {
        await dispatch(
          updateProduct({
            id: selectedProduct._id,
            updatedData: convertToPlainProduct(data),
          })
        );
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        await dispatch(addProduct(convertToPlainProduct(data)));
        toast.success("Tạo sản phẩm thành công");
      }

      dispatch(
        fetchAllProducts({
          page: currentPage,
          limit: LIMIT,
          search: searchTerm.trim(),
        })
      );
    } catch (error) {
      toast.error("Lỗi khi lưu sản phẩm");
    } finally {
      setSelectedProduct(null);
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProductToDelete(product);
    setOpenConfirmModal(true);
  };

  const confirmDeleteProduct = async () => {
    if (!selectedProductToDelete) return;
    try {
      await dispatch(
        deleteProduct({
          id: selectedProductToDelete._id,
          deletedImages: selectedProductToDelete.deletedImages || [],
        })
      );
      toast.success("Xoá sản phẩm thành công");
      dispatch(
        fetchAllProducts({
          page: currentPage,
          limit: LIMIT,
          search: searchTerm.trim(),
        })
      );
    } catch (error) {
      toast.error("Lỗi khi xoá sản phẩm");
    } finally {
      setOpenConfirmModal(false);
      setSelectedProductToDelete(null);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold">Quản lý sản phẩm</h2>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-8 w-full sm:w-[250px]"
            />
          </div>
          <Button onClick={() => setOpenModal(true)}>
            <PlusIcon className="mr-2 w-4 h-4" />
            Tạo sản phẩm
          </Button>
        </div>
      </div>

      <ProductTable
        products={products}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <ProductFormModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleCreateOrUpdateProduct}
        isEdit={!!selectedProduct}
        initialData={
          selectedProduct
            ? convertProductToFormState(selectedProduct)
            : undefined
        }
        brands={brands}
        categories={categories}
      />

      <ConfirmModal
        open={openConfirmModal}
        onClose={() => {
          setOpenConfirmModal(false);
          setSelectedProductToDelete(null);
        }}
        onConfirm={confirmDeleteProduct}
        title="Xác nhận xoá sản phẩm?"
        description={`Bạn có chắc chắn muốn xoá sản phẩm "${selectedProductToDelete?.title}"?`}
        confirmText="Xoá"
      />
    </div>
  );
}
