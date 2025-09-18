import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  deleteUser,
  fetchUsers,
  updateRole,
  updateStatus,
} from "@/store/admin/user-slice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Trash2 } from "lucide-react";
import DeleteModal from "@/components/common/delete-modal";
import { Pagination } from "@/components/common/pagination";
import { UserRole } from "@/store/auth-slice/auth.types";
import { UserStatus } from "@/store/admin/user-slice/user.types";

const UserManagementPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, pagination } = useSelector(
    (state: RootState) => state.adminUsers
  );

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "">("");
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    userId: string | null;
  }>({
    open: false,
    userId: null,
  });

  useEffect(() => {
    dispatch(
      fetchUsers({
        page: pagination.page,
        limit: pagination.limit,
        search,
        filter: {
          role: roleFilter || undefined,
          status: statusFilter || undefined,
        },
      })
    );
  }, [
    dispatch,
    pagination.page,
    pagination.limit,
    search,
    roleFilter,
    statusFilter,
  ]);

  const handleRoleChange = (userId: string, role: UserRole) => {
    dispatch(updateRole({ userId, role }));
  };

  const handleStatusChange = (userId: string, isActive: boolean) => {
    dispatch(updateStatus({ userId, isActive }));
  };

  const handleDelete = (userId: string) => {
    setConfirmDelete({ open: true, userId });
  };

  const confirmDeleteUser = () => {
    if (confirmDelete.userId) {
      dispatch(deleteUser(confirmDelete.userId));
    }
    setConfirmDelete({ open: false, userId: null });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Quản lý người dùng</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />

        <Select
          value={roleFilter}
          onValueChange={(val) => setRoleFilter(val as UserRole | "")}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Lọc theo role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(val) => setStatusFilter(val as UserStatus | "")}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Bị khoá</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={() =>
            dispatch(
              fetchUsers({
                page: 1,
                limit: pagination.limit,
                search,
                filter: {
                  role: roleFilter || undefined,
                  status: statusFilter || undefined,
                },
              })
            )
          }
        >
          Tìm kiếm
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  <Loader2 className="animate-spin w-6 h-6 mx-auto" />
                </TableCell>
              </TableRow>
            ) : list && list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Không có người dùng nào
                </TableCell>
              </TableRow>
            ) : (
              list &&
              list.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value) =>
                        handleRoleChange(user._id, value as UserRole)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.isActive}
                      onCheckedChange={(checked) =>
                        handleStatusChange(user._id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(user._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(page) =>
          dispatch(
            fetchUsers({
              page,
              limit: pagination.limit,
              search,
              filter: {
                role: roleFilter || undefined,
                status: statusFilter || undefined,
              },
            })
          )
        }
      />

      {/* Confirm delete */}
      <DeleteModal
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, userId: null })}
        onConfirm={confirmDeleteUser}
        title="Xoá người dùng"
        description="Bạn có chắc chắn muốn xoá người dùng này? Hành động này không thể hoàn tác."
        confirmText="Xoá"
      />
    </div>
  );
};

export default UserManagementPage;
