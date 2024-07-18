"use client";

import SidebarMenuItemsLayout from "./layouts/SidebarMenuItemsLayout";
import SidebarMenuItem from "@/components/SidebarMenuItem";
import SidebarTopItem from "./SidebarTopItem";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { logOut } from "@/redux/features/auth-slice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store";

const Sidebar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentUrl = usePathname();
  const baseUrl = currentUrl.split("/").slice(0, 2).join("/");
  const [menuItemsList, setMenuItemsList] = useState([
    { pageName: "", pageRoute: "" },
  ]);
  const activeUser = useAppSelector((state) => state.auth.value.username);
  // logout handler
  const handleLogOut = () => {
    dispatch(logOut());
    router.push("/login");
  };

  useEffect(() => {
    const salesMenus = [
      {
        pageName: "Profiling",
        pageRoute: "profiling",
      },
      {
        pageName: "Proforma Invoice",
        pageRoute: "proforma-invoice",
      },
      {
        pageName: "Stok Barang",
        pageRoute: "stok-barang",
      },
      // {
      //   pageName: "Sewa Alat",
      //   pageRoute: "sewa-alat",
      // },
    ];

    const logistikMenus = [
      {
        pageName: "Stok Barang",
        pageRoute: "stok-barang",
      },
      {
        pageName: "Rental Items",
        pageRoute: "rental-items",
      },
      {
        pageName: "Documents",
        pageRoute: "documents",
      },
    ];

    const adminMenus = [
      {
        pageName: "Proforma Invoice",
        pageRoute: "proforma-invoice",
      },
      {
        pageName: "Purchase Order",
        pageRoute: "purchase-order",
      },
      {
        pageName: "Stok Barang",
        pageRoute: "stok-barang",
      },
      {
        pageName: "Sewa Barang",
        pageRoute: "sewa-barang",
      },
      {
        pageName: "Sales Order",
        pageRoute: "sales-order",
      },
    ];

    const financeMenus = [
      {
        pageName: "Piutang",
        pageRoute: "piutang",
      },
      {
        pageName: "Hutang",
        pageRoute: "hutang",
      },
      {
        pageName: "Pemasukan",
        pageRoute: "pemasukan",
      },
      {
        pageName: "Pengeluaran",
        pageRoute: "pengeluaran",
      },
      {
        pageName: "Sales Order",
        pageRoute: "sales-order",
      },
      {
        pageName: "Purchase Order",
        pageRoute: "purchase-order",
      },
      // {
      //   pageName: "Komisi",
      //   pageRoute: "komisi",
      // },
    ];

    switch (activeUser) {
      case "sales":
        setMenuItemsList(salesMenus);
        break;
      case "logistik":
        setMenuItemsList(logistikMenus);
        break;
      case "admin":
        setMenuItemsList(adminMenus);
        break;
      case "finance":
        setMenuItemsList(financeMenus);
        break;
    }
  }, [activeUser]);

  return (
    <div className="fixed z-50 flex h-screen w-[17.3vw] min-w-[107px] flex-col items-center justify-between bg-[#011869] p-5">
      <SidebarTopItem />
      <SidebarMenuItemsLayout>
        {menuItemsList.map((menuItem, index) => (
          <SidebarMenuItem
            key={index}
            active={baseUrl === "/" + menuItem.pageRoute}
            pageName={menuItem.pageName}
            pageRoute={menuItem.pageRoute}
          />
        ))}
      </SidebarMenuItemsLayout>
      <Button className="w-full font-bold" onClick={handleLogOut}>
        Log Out
      </Button>
    </div>
  );
};

export default Sidebar;
