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
  const [menuItemsList, setMenuItemsList] = useState([
    { activePage: "", pageName: "", pageRoute: "" },
  ]);
  useEffect(() => setIsActive(currentUrl), [currentUrl, isActive]);

  useEffect(() => {
    const salesMenus = [
      {
        activePage: "/profiling",
        pageName: "Profiling",
        pageRoute: "profiling",
      },
      {
        activePage: "/proforma-invoice",
        pageName: "Proforma Invoice",
        pageRoute: "proforma-invoice",
      },
      {
        activePage: "/stok-barang",
        pageName: "Stok Barang",
        pageRoute: "stok-barang",
      },
      {
        activePage: "/sewa-alat",
        pageName: "Sewa Alat",
        pageRoute: "sewa-alat",
      },
    ];

    const logistikMenus = [
      {
        activePage: "/stok-barang",
        pageName: "Stok Barang",
        pageRoute: "stok-barang",
      },
      {
        activePage: "/rental-items",
        pageName: "Rental Items",
        pageRoute: "rental-items",
      },
      {
        activePage: "/documents",
        pageName: "Documents",
        pageRoute: "documents",
      },
    ];

    if (isActive === "/profiling") {
      setMenuItemsList(salesMenus);
    } else if (isActive === "/stok-barang") {
      setMenuItemsList(logistikMenus);
    }
  }, [isActive]);

  return (
    <div className="flex h-screen w-[17.3vw] min-w-[107px] flex-col items-center justify-between bg-[#011869] p-5">
      <SidebarTopItem />
      <SidebarMenuItemsLayout>
        {menuItemsList.map((menuItem, index) => (
          <SidebarMenuItem
            key={index}
            active={isActive === menuItem.activePage}
            pageName={menuItem.pageName}
            pageRoute={menuItem.pageRoute}
          />
        ))}
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
