"use client";

import SidebarMenuItem from "@/components/SidebarMenuItem";
import { Button } from "@nextui-org/react";
import SidebarTopItem from "./SidebarTopItem";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  return (
    <div className="flex h-screen w-[17.3vw] flex-col items-center justify-between bg-[#011869] p-5">
      <SidebarTopItem />
      <div className="flex w-full flex-col gap-3">
        <SidebarMenuItem active pageName="Profiling" pageRoute="profiling" />
        <SidebarMenuItem
          pageName="Proforma Invoice"
          pageRoute="proforma-invoice"
        />
        <SidebarMenuItem pageName="Stok Barang" pageRoute="stok-barang" />
        <SidebarMenuItem pageName="Sewa Alat" pageRoute="sewa-alat" />
      </div>
      <Button
        className="w-full font-bold"
        onClick={() => router.push("/login")}
      >
        Log Out
      </Button>
    </div>
  );
};

export default Sidebar;
