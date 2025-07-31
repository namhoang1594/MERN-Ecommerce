import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ISettingInfo } from "@/store/admin/site-setting/setting-slice/setting.types";
import { updateInfo } from "@/store/admin/site-setting/setting-slice";

const InfoForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const setting = useSelector((state: RootState) => state.adminSetting);

  const [form, setForm] = useState<ISettingInfo>({
    hotline: "",
    email: "",
    footerText: "",
    slogan: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    dispatch(updateInfo(form))
      .then(() => toast.success("Updated successfully"))
      .catch(() => toast.error("Update failed"));
  };

  useEffect(() => {
    if (setting.info) {
      setForm(setting.info);
    }
  }, [setting.info]);

  return (
    <div className="space-y-4 max-w-xl">
      <h2 className="text-xl font-semibold mb-2">Thông tin website</h2>

      <Input
        name="hotline"
        placeholder="Hotline"
        value={form.hotline}
        onChange={handleChange}
      />

      <Input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <Textarea
        name="footerText"
        placeholder="Footer text"
        value={form.footerText}
        onChange={handleChange}
      />

      <Textarea
        name="slogan"
        placeholder="Slogan"
        value={form.slogan}
        onChange={handleChange}
      />

      <Button onClick={handleSubmit}>Lưu thay đổi</Button>
    </div>
  );
};

export default InfoForm;
