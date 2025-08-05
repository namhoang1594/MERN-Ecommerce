import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import ConfirmModal from "@/components/common/confirm-modal";
import { Category } from "@/store/admin/category-slice/category.types";
import {
  deleteCategory,
  fetchAllCategory,
  setCurrentCategory,
  setIsEdit,
  setOpenModal,
} from "@/store/admin/category-slice";
import CategoryFormModal from "./categoryFormModal";

const CategoryPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categoryList, isLoading, openModal, isEdit } = useSelector(
    (state: RootState) => state.adminCategory
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredList, setFilteredList] = useState<Category[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchAllCategory());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm.trim()) {
      setFilteredList(
        categoryList.filter((b) =>
          b.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredList(categoryList);
    }
  }, [searchTerm, categoryList]);

  const handleEdit = (category: Category) => {
    dispatch(setCurrentCategory(category));
    dispatch(setIsEdit(true));
    dispatch(setOpenModal(true));
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete?._id) return;
    setConfirmOpen(false);
    setCategoryToDelete(null);
    try {
      await dispatch(deleteCategory(categoryToDelete._id));
      toast.success("Xóa danh mục thành công!");
    } catch (error) {
      toast.error("Có lỗi khi xóa danh mục.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Tìm kiếm danh mục..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          onClick={() => {
            dispatch(setCurrentCategory(null));
            dispatch(setIsEdit(false));
            dispatch(setOpenModal(true));
          }}
        >
          Tạo danh mục mới
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hình ảnh</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredList.map((category) => (
              <TableRow key={category._id}>
                <TableCell>
                  <img
                    src={category.image?.url}
                    alt={category.name}
                    className="h-10 w-10 object-cover rounded"
                  />
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(category)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(category)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredList.length === 0 && !isLoading && (
          <p className="text-center text-muted-foreground p-4">
            Không có danh mục nào.
          </p>
        )}
      </div>

      {/* Modal */}
      <CategoryFormModal
        open={openModal}
        isEdit={isEdit}
        onClose={() => dispatch(setOpenModal(false))}
        onSuccess={() => dispatch(fetchAllCategory())}
      />

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa"
        description={`Bạn có chắc chắn muốn xóa brand "${categoryToDelete?.name}"?`}
      />
    </div>
  );
};

export default CategoryPage;
