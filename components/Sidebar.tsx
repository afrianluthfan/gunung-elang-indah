"use client";

import SidebarMenuItemsLayout from "./layouts/SidebarMenuItemsLayout";
import SidebarMenuItem from "./SidebarMenuItem";
import SidebarTopItem from "./SidebarTopItem";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { logOut } from "../redux/features/auth-slice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../redux/store";

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
    // Dispatch action untuk logout
    dispatch(logOut());
    
    // Clear localStorage
    localStorage.clear(); // Menghapus semua data dari LocalStorage

    // Redirect ke halaman login
    router.push("/login");
  };

  useEffect(() => {
    const salesMenus = [
      {
        pageName: "Proforma Invoice",
        pageRoute: "proforma-invoice-dua",
      },
      {
        pageName: "Stok Barang",
        pageRoute: "stok-barang-sales",
      },
    ];

    const logistikMenus = [
      {
        pageName: "Stok Barang",
        pageRoute: "stok-barang",
      },
      {
        pageName: "Documents",
        pageRoute: "dokumen-logistik",
      },
    ];

    const adminMenus = [
      {
        pageName: "Profiling",
        pageRoute: "profiling-dua",
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
        pageName: "Sales Order",
        pageRoute: "sales-order-sales",
      },
      {
        pageName: "Price List",
        pageRoute: "price-list",
      },
      {
        pageName: "Data Gudang",
        pageRoute: "gudang",
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
        pageRoute: "sales-order-finance",
      },
      {
        pageName: "Purchase Order",
        pageRoute: "purchase-order",
      },
      {
        pageName: "Stok Barang",
        pageRoute: "stok-barang",
      },
    ];

    const superAdmin = [
      {
        pageName: "Profiling",
        pageRoute: "profiling",
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
        pageName: "Proforma Invoice",
        pageRoute: "proforma-invoice-dua",
      },
      {
        pageName: "Stok Barang",
        pageRoute: "stok-barang",
      },
      // {
      //   pageName: "Sewa Barang",
      //   pageRoute: "sewa-barang",
      // },
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
        pageName: "Dokumen Logistik",  
        pageRoute: "dokumen-logistik",
      },
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
      case "SUPER_ADMIN": // Pastikan untuk menambahkan case untuk super admin
        setMenuItemsList(superAdmin);
        break;
      default:
        setMenuItemsList([]); // Mengatur default jika tidak ada user yang cocok
    }
  }, [activeUser]);

  return (
    <div className="fixed flex h-screen w-full flex-col items-center justify-between bg-[#0C295F] p-1 md:w-[17.3vw] md:p-5">
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
