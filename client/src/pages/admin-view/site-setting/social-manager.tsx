import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ISocialLink } from "@/store/admin/site-setting/setting-slice/setting.types";
import { updateSocialLinks } from "@/store/admin/site-setting/setting-slice";

const SocialLinksManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { socialLinks } = useSelector((state: RootState) => state.adminSetting);
  const [newLink, setNewLink] = useState<ISocialLink>({
    icon: "",
    name: "",
    url: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof ISocialLink
  ) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: e.target.value };
    dispatch(updateSocialLinks(updated));
  };

  const handleAdd = () => {
    if (!newLink.icon || !newLink.name || !newLink.url) return;
    const updated = [...socialLinks, newLink];
    dispatch(updateSocialLinks(updated));
    setNewLink({ icon: "", name: "", url: "" });
  };

  const handleDelete = (index: number) => {
    const updated = socialLinks.filter((_, i) => i !== index);
    dispatch(updateSocialLinks(updated));
  };

  return (
    <div className="space-y-6">
      {socialLinks.map((link, idx) => (
        <div
          key={idx}
          className="grid grid-cols-3 gap-2 items-center border p-2 rounded-md"
        >
          <Input
            value={link.icon}
            onChange={(e) => handleChange(e, idx, "icon")}
            placeholder="Icon"
          />
          <Input
            value={link.name}
            onChange={(e) => handleChange(e, idx, "name")}
            placeholder="Name"
          />
          <Input
            value={link.url}
            onChange={(e) => handleChange(e, idx, "url")}
            placeholder="URL"
          />
          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleDelete(idx)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}

      <div className="grid grid-cols-3 gap-2 items-center border p-2 rounded-md">
        <Input
          value={newLink.icon}
          onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
          placeholder="Icon"
        />
        <Input
          value={newLink.name}
          onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
          placeholder="Name"
        />
        <Input
          value={newLink.url}
          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
          placeholder="URL"
        />
        <Button onClick={handleAdd}>Add</Button>
      </div>
    </div>
  );
};

export default SocialLinksManager;
