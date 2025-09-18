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
import { Brand } from "@/store/admin/brand-slice/brand.types";
import BrandFormModal from "./brandFormModal";
import DeleteModal from "@/components/common/delete-modal";
import {
  deleteBrand,
  fetchAllBrands,
  setCurrentBrand,
  setIsEdit,
  setOpenModal,
} from "@/store/admin/brand-slice";

const BrandPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { brandList, isLoading, openModal, isEdit } = useSelector(
    (state: RootState) => state.adminBrand
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredList, setFilteredList] = useState<Brand[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  useEffect(() => {
    dispatch(fetchAllBrands());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm.trim()) {
      setFilteredList(
        brandList.filter((b) =>
          b.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredList(brandList);
    }
  }, [searchTerm, brandList]);

  const handleEdit = (brand: Brand) => {
    dispatch(setCurrentBrand(brand));
    dispatch(setIsEdit(true));
    dispatch(setOpenModal(true));
  };

  const handleDelete = (brand: Brand) => {
    setBrandToDelete(brand);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!brandToDelete?._id) return;
    setConfirmOpen(false);
    setBrandToDelete(null);
    try {
      await dispatch(deleteBrand(brandToDelete._id));
      toast.success("Xóa thương hiệu thành công!");
    } catch (error) {
      toast.error("Có lỗi khi xóa thương hiệu.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Tìm kiếm thương hiệu..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          onClick={() => {
            dispatch(setCurrentBrand(null));
            dispatch(setIsEdit(false));
            dispatch(setOpenModal(true));
          }}
        >
          Tạo thương hiệu mới
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hình ảnh</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredList.map((brand) => (
              <TableRow key={brand._id}>
                <TableCell>
                  <img
                    src={brand.image?.url}
                    alt={brand.name}
                    className="h-10 w-10 object-contain rounded"
                  />
                </TableCell>
                <TableCell>{brand.name}</TableCell>
                <TableCell>{brand.description || "-"}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(brand)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(brand)}
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
            Không có thương hiệu nào.
          </p>
        )}
      </div>

      {/* Modal */}
      <BrandFormModal
        open={openModal}
        isEdit={isEdit}
        onClose={() => dispatch(setOpenModal(false))}
        onSuccess={() => dispatch(fetchAllBrands())}
      />

      <DeleteModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa"
        description={`Bạn có chắc chắn muốn xóa thương hiệu "${brandToDelete?.name}"?`}
      />
    </div>
  );
};

export default BrandPage;
