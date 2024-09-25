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
  const activeUser = useAppSelector((state) => state.auth.value.statusAcount);
  // logout handler
  const handleLogOut = () => {
    dispatch(logOut());
    // clear localstorage
    localStorage.removeItem("statusAccount");
    localStorage.removeItem("username");
    localStorage.removeItem("persist:root");
    localStorage.removeItem("token");

    dispatch(logOut());

    router.push("/login");
  };

  useEffect(() => {
    const salesMenus = [
      // {
      //   pageName: "Profiling",
      //   pageRoute: "profiling",
      // },
      {
        pageName: "Proforma Invoice",
        pageRoute: "proforma-invoice-dua",
      },
      {
        pageName: "Stok Barang",
        pageRoute: "stok-barang-sales",
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
        pageName: "Profiling",
        pageRoute: "profiling",
      },
      {
        pageName: "Proforma Invoice",
        pageRoute: "proforma-invoice-dua",
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
      {
        pageName: "Stok Barang",
        pageRoute: "stok-barang",
      },
      // {
      //   pageName: "Komisi",
      //   pageRoute: "komisi",
      // },
    ];

    // buatkan untuk super admin dan munculin semua navigasi routennya
    const superAdmin = [
      {
        pageName: "Profiling",
        pageRoute: "profiling",
      },
      {
        pageName: "Proforma Invoice",
        pageRoute: "proforma-invoice-dua",
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
      // {
      //   pageName: "Komisi",
      //   pageRoute: "komisi",
      // },
    ];

    switch (activeUser) {
      case "SALES":
        setMenuItemsList(salesMenus);
        break;
      case "LOGISTIK":
        setMenuItemsList(logistikMenus);
        break;
      case "ADMIN":
        setMenuItemsList(adminMenus);
        break;
      case "KEUANGAN":
        setMenuItemsList(financeMenus);
        break;
    }
  }, [activeUser]);

  return (
    <div className="fixed flex h-screen w-full flex-col items-center justify-between bg-[#011869] p-1 md:w-[17.3vw] md:p-5">
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
      <Button
        className="w-fit min-w-16 px-0 text-xs font-bold lg:w-full lg:px-4 lg:text-sm"
        onClick={handleLogOut}
      >
        Log Out
      </Button>
    </div>
  );
};

export default Sidebar;
