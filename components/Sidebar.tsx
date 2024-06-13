"use client";

import SidebarMenuItemsLayout from "./layouts/SidebarMenuItemsLayout";
import SidebarMenuItem from "@/components/SidebarMenuItem";
import SidebarTopItem from "./SidebarTopItem";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";

const Sidebar = () => {
  const router = useRouter();
  const [isActive, setIsActive] = useState("");
  const currentUrl = usePathname();
  useEffect(() => setIsActive(currentUrl), [isActive]);

  return (
    <div className="flex h-screen w-[17.3vw] min-w-[107px] flex-col items-center justify-between bg-[#011869] p-5">
      <SidebarTopItem />
      <SidebarMenuItemsLayout>
        <SidebarMenuItem
          active={isActive === "/profiling"}
          pageName="Profiling"
          pageRoute="profiling"
        />
        <SidebarMenuItem
          active={isActive === "/proforma-invoice"}
          pageName="Proforma Invoice"
          pageRoute="proforma-invoice"
        />
        <SidebarMenuItem
          active={isActive === "/stok-barang"}
          pageName="Stok Barang"
          pageRoute="stok-barang"
        />
        <SidebarMenuItem
          active={isActive === "/sewa-alat"}
          pageName="Sewa Alat"
          pageRoute="sewa-alat"
        />
      </SidebarMenuItemsLayout>
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
