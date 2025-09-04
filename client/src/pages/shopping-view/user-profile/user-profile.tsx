import { useState } from "react";
import ProfileInfo from "./user-profile-info";
import ChangePassword from "./user-profile-changepwd";
import AddressList from "./user-profile-addresses";
import ProfileSidebar from "./user-profile-sidebar";
import { TabType } from "@/store/shop/user-profile-slice/user-profile.types";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("info");

  return (
    <div className="max-w-6xl mx-auto p-6 flex gap-6">
      {/* Sidebar */}
      <div className="w-1/4">
        <ProfileSidebar activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-2xl shadow p-6">
        {activeTab === "info" && <ProfileInfo setActiveTab={setActiveTab} />}
        {activeTab === "password" && <ChangePassword />}
        {activeTab === "addresses" && <AddressList />}
      </div>
    </div>
  );
};

export default ProfilePage;
