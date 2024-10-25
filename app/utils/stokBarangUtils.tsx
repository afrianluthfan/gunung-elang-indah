import axios from "axios";
import { SortDescriptor } from "@nextui-org/react";

export type Gudang = {
  id: number;
  nama_gudang: string;
  alamat_gudang: string;
};

export type StokBarang = {
  kode: string;
  namaGudang: string;
  nama: string;
  qty: number;
  harga: string;
  variable: string;
};

// Add this to your utils file (e.g., stockUtils.tsx)

type BarangAdmin = {
  kode: string;
  namaGudang: string;
  nama: string;
  qty: number;
  harga: string;
  variable: string;
  number?: number;
};

export const fetchGudangList = async (
  setGudangList: React.Dispatch<React.SetStateAction<Gudang[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  try {
    const response = await axios.post(
      `http://209.182.237.155:8080/api/gudang/list`,
    );
    setGudangList(response.data.data);
  } catch (error) {
    setError("Error fetching Gudang list");
    console.error("Error fetching Gudang list:", error);
  }
};

export const fetchDataGudang = async (
  gudang: string,
  setStokBarang: (stokBarang: StokBarang[]) => void,
  setError: (error: string | null) => void,
) => {
  try {
    let response;
    if (gudang && gudang !== "0") {
      response = await axios.post(
        `http://209.182.237.155:8080/api/stok/listbygudang`,
        { id: gudang },
      );
    } else {
      response = await axios.post(
        "http://209.182.237.155:8080/api/stok/list-customer",
        {},
      );
    }
    setStokBarang(response.data.data);
  } catch (error) {
    setError("Error fetching data");
    console.error("Error fetching data:", error);
  }
};

export const sortItems = (
  items: StokBarang[],
  sortDescriptor: SortDescriptor,
) => {
  return [...items].sort((a: StokBarang, b: StokBarang) => {
    const firstValue = a[sortDescriptor.column as keyof StokBarang] ?? "";
    const secondValue = b[sortDescriptor.column as keyof StokBarang] ?? "";

    if (sortDescriptor.column) {
      // Handle date column
      if (sortDescriptor.column === "created_at") {
        const dateA = new Date(firstValue as string).getTime();
        const dateB = new Date(secondValue as string).getTime();
        return sortDescriptor.direction === "descending"
          ? dateB - dateA
          : dateA - dateB;
      }
    }

    // Default string comparison for other columns
    const cmp = String(firstValue).localeCompare(String(secondValue));
    return sortDescriptor.direction === "descending" ? -cmp : cmp;
  });
};

export const sortItemsAdmin = (
  items: BarangAdmin[],
  sortDescriptor: SortDescriptor,
) => {
  return [...items].sort((a: BarangAdmin, b: BarangAdmin) => {
    const firstValue = a[sortDescriptor.column as keyof BarangAdmin] ?? "";
    const secondValue = b[sortDescriptor.column as keyof BarangAdmin] ?? "";

    if (sortDescriptor.column) {
      // Handle numeric quantity column
      if (sortDescriptor.column === "qty") {
        const firstNumeric = Number(firstValue) || 0;
        const secondNumeric = Number(secondValue) || 0;
        return sortDescriptor.direction === "descending"
          ? secondNumeric - firstNumeric
          : firstNumeric - secondNumeric;
      }

      // Handle price column (assuming format like "Rp 1.000.000")
      if (sortDescriptor.column === "harga") {
        const firstNumeric =
          parseFloat(String(firstValue).replace(/[^0-9,]+/g, "")) || 0;
        const secondNumeric =
          parseFloat(String(secondValue).replace(/[^0-9,]+/g, "")) || 0;
        const comparison = firstNumeric - secondNumeric;
        return sortDescriptor.direction === "descending"
          ? -comparison
          : comparison;
      }

      // Skip sorting for 'number' column as it's auto-generated
      if (sortDescriptor.column === "number") {
        return 0;
      }
    }

    // Default string comparison for other columns (nama, kode, namaGudang, variable)
    const cmp = String(firstValue).localeCompare(String(secondValue));
    return sortDescriptor.direction === "descending" ? -cmp : cmp;
  });
};
