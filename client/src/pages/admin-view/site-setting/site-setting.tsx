import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { fetchSetting } from "@/store/admin/site-setting/setting-slice";
import LogoManager from "./logo-manager";
import SocialLinksManager from "./social-manager";
import InfoForm from "./infoForm";

const SettingManager = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchSetting());
  }, [dispatch]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Setting Manager</h1>

      <Tabs defaultValue="logo" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="info">Thông tin</TabsTrigger>
        </TabsList>

        <TabsContent value="logo">
          <LogoManager />
        </TabsContent>

        <TabsContent value="social">
          <SocialLinksManager />
        </TabsContent>

        <TabsContent value="info">
          <InfoForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingManager;
