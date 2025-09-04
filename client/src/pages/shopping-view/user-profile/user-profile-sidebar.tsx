import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TabType } from "@/store/shop/user-profile-slice/user-profile.types";

interface Props {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

const tabs = [
  { key: "info", label: "Thông tin cá nhân" },
  { key: "password", label: "Đổi mật khẩu" },
  { key: "addresses", label: "Địa chỉ" },
] as const;

const ProfileSidebar: React.FC<Props> = ({ activeTab, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      {tabs.map((t) => (
        <Button
          key={t.key}
          variant={activeTab === t.key ? "default" : "outline"}
          className={cn(
            "w-full justify-start",
            activeTab === t.key && "bg-primary text-white"
          )}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </Button>
      ))}
    </div>
  );
};

export default ProfileSidebar;
