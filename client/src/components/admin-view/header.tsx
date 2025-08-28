import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/auth-slice";
import { AppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";

type AdminHeaderProps = {
  setOpen: (open: boolean) => void;
};

function AdminHeader({ setOpen }: AdminHeaderProps): React.ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/auth/login");
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end ">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Log out
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
