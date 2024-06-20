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
  const [isActive, setIsActive] = useState("");
  const currentUrl = usePathname();
  const [menuItemsList, setMenuItemsList] = useState([
    { activePage: "", pageName: "", pageRoute: "" },
  ]);
  const activeUser = useAppSelector(
    (state) => state.authReducer.value.username,
  );
  const handleLogOut = () => {
    dispatch(logOut());
    router.push("/login");
  };

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

    const adminMenus = [
      {
        activePage: "/proforma-invoice",
        pageName: "Proforma Invoice",
        pageRoute: "proforma-invoice",
      },
      {
        activePage: "/purchase-order",
        pageName: "Purchase Order",
        pageRoute: "purchase-order",
      },
      {
        activePage: "/stok-barang",
        pageName: "Stok Barang",
        pageRoute: "stok-barang",
      },
      {
        activePage: "/sewa-barang",
        pageName: "Sewa Barang",
        pageRoute: "sewa-barang",
      },
      {
        activePage: "/sales-order",
        pageName: "Sales Order",
        pageRoute: "sales-order",
      },
    ];

    const financeMenus = [
      {
        activePage: "/piutang",
        pageName: "Piutang",
        pageRoute: "piutang",
      },
      {
        activePage: "/hutang",
        pageName: "hutang",
        pageRoute: "hutang",
      },
      {
        activePage: "/pemasukan",
        pageName: "Pemasukan",
        pageRoute: "pemasukan",
      },
      {
        activePage: "/pengeluaran",
        pageName: "Pengeluaran",
        pageRoute: "pengeluaran",
      },
      {
        activePage: "/sales-order",
        pageName: "Sales Order",
        pageRoute: "sales-order",
      },
      {
        activePage: "/komisi",
        pageName: "Komisi",
        pageRoute: "komisi",
      },
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
      <Button className="w-full font-bold" onClick={handleLogOut}>
        Log Out
      </Button>
    </div>
  );
};

export default Sidebar;
