import { ChipProps, SortDescriptor } from "@nextui-org/react";
import axios from "axios";

export const columns = [
  { name: "NO.", uid: "number" },
  { name: "TANGGAL", uid: "tanggal", sortable: true },
  { name: "NAMA SUPLIER", uid: "nama_suplier", sortable: true },
  { name: "NOMOR PO", uid: "nomor_po", sortable: true },
  { name: "SUB TOTAL", uid: "sub_total", sortable: true },
  { name: "TOTAL", uid: "total", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export type ItemData = {
  id: number;
  tanggal: string;
  nama_suplier: string;
  nomor_po: string;
  sub_total: string;
  total: string;
  status: string;
}[];

export type User = ItemData[0];

export const statusColorMap: Record<string, ChipProps["color"]> = {
  DITERIMA: "success",
  DITOLAK: "danger",
  DIPROSES: "primary",
};

export const fetchPOData = async (
  setUsers: React.Dispatch<React.SetStateAction<ItemData>>,
) => {
  try {
    const response = await axios.post(
      "http://209.182.237.155:8080/api/purchase-order/list",
    );
    if (response.data.status) {
      setUsers(response.data.data);
    } else {
      console.error("Failed to fetch data:", response.data.message);
    }
  } catch (error) {
    console.error("Error fetching data from API:", error);
  }
};

export const sortItems = (items: User[], sortDescriptor: SortDescriptor) => {
  return [...items].sort((a: User, b: User) => {
    const firstValue = a[sortDescriptor.column as keyof User] ?? "";
    const secondValue = b[sortDescriptor.column as keyof User] ?? "";

    if (sortDescriptor.column) {
      // Handle status column
      if (sortDescriptor.column === "status") {
        const cmp = String(firstValue).localeCompare(String(secondValue));
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }

      // Handle currency/price columns (total, etc.)
      if (
        ["total", "sub_total", "harga"].includes(
          sortDescriptor.column as string,
        )
      ) {
        const firstNumeric =
          parseFloat(String(firstValue).replace(/[^0-9,]+/g, "")) || 0;
        const secondNumeric =
          parseFloat(String(secondValue).replace(/[^0-9,]+/g, "")) || 0;
        const comparison = firstNumeric - secondNumeric;
        return sortDescriptor.direction === "descending"
          ? -comparison
          : comparison;
      }

      // Handle date column with DD-MM-YYYY format
      if (sortDescriptor.column === "tanggal") {
        // Convert DD-MM-YYYY to YYYY-MM-DD for proper date comparison
        const [dayA, monthA, yearA] = String(firstValue).split("-");
        const [dayB, monthB, yearB] = String(secondValue).split("-");

        const dateA = new Date(`${yearA}-${monthA}-${dayA}`).getTime();
        const dateB = new Date(`${yearB}-${monthB}-${dayB}`).getTime();

        return sortDescriptor.direction === "descending"
          ? dateB - dateA
          : dateA - dateB;
      }

      // Handle other numeric columns that don't have currency formatting
      if (!isNaN(Number(firstValue)) && !isNaN(Number(secondValue))) {
        const firstNumeric = Number(firstValue);
        const secondNumeric = Number(secondValue);
        return sortDescriptor.direction === "descending"
          ? secondNumeric - firstNumeric
          : firstNumeric - secondNumeric;
      }
    }

    // Default string comparison for other columns
    const cmp = String(firstValue).localeCompare(String(secondValue));
    return sortDescriptor.direction === "descending" ? -cmp : cmp;
  });
};
