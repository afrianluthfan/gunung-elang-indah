import axios from "axios";
import { ChipProps, SortDescriptor } from "@nextui-org/react";

export type User = {
  id: number;
  created_at: string;
  divisi: string;
  invoice_number: string;
  sub_total: string;
  total: string;
  status: string;
  nama_company: string;
  update_at: string;
  updated_by: string;
};

export const columns = [
  { name: "NO.", uid: "number" },
  { name: "TANGGAL", uid: "created_at", sortable: true },
  { name: "NAMA PERUSAHAAN", uid: "nama_company", sortable: true },
  { name: "NOMOR PI", uid: "invoice_number", sortable: true },
  { name: "TOTAL", uid: "total", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "LAST UPDATE", uid: "update_at", sortable: true },
  { name: "UPDATED BY", uid: "updated_by" },
  { name: "ACTIONS", uid: "actions" },
];

export const statusColorMap: Record<string, ChipProps["color"]> = {
  DITERIMA: "success",
  DITOLAK: "danger",
  DIPROSES: "primary",
};

// Function to handle duplicate entries
export const processDuplicateData = (data: User[]): User[] => {
  // Create a map to store the latest version of each invoice
  const invoiceMap = new Map<string, User>();

  // Process each record
  data.forEach((record) => {
    const key = `${record.id}-${record.invoice_number}`;
    const existingRecord = invoiceMap.get(key);

    // If no existing record, or if this record is more recent, update the map
    if (
      !existingRecord ||
      new Date(record.update_at) > new Date(existingRecord.update_at)
    ) {
      invoiceMap.set(key, record);
    }
  });

  // Convert map values back to array
  return Array.from(invoiceMap.values());
};

// Enhanced fetch data function
export const fetchSOData = async (
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
) => {
  try {
    const response = await axios.post(
      "http://209.182.237.155:8080/api/proforma-invoice/get-all-list-so",
    );
    if (response.data.status) {
      // Process the data to handle duplicates before setting state
      const processedData = processDuplicateData(response.data.data);
      setUsers(processedData);
    } else {
      console.error("Failed to fetch data:", response.data.message);
    }
  } catch (error) {
    console.error("Error fetching data from API:", error);
  }
};

// Enhanced sorting function
export const sortItems = (items: User[], sortDescriptor: SortDescriptor) => {
  return [...items].sort((a: User, b: User) => {
    const firstValue = a[sortDescriptor.column as keyof User] ?? "";
    const secondValue = b[sortDescriptor.column as keyof User] ?? "";

    if (sortDescriptor.column) {
      // Handle status column
      if (sortDescriptor.column === "status") {
        const cmp = String(firstValue)
          .toLowerCase()
          .localeCompare(String(secondValue).toLowerCase());
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }

      // Handle currency/price columns (total, sub_total, etc.)
      if (["total", "sub_total"].includes(sortDescriptor.column as string)) {
        const firstNumeric =
          parseFloat(String(firstValue).replace(/[^0-9,]+/g, "")) || 0;
        const secondNumeric =
          parseFloat(String(secondValue).replace(/[^0-9,]+/g, "")) || 0;
        const comparison = firstNumeric - secondNumeric;
        return sortDescriptor.direction === "descending"
          ? -comparison
          : comparison;
      }

      // Handle date columns
      if (
        ["created_at", "update_at"].includes(sortDescriptor.column as string)
      ) {
        const dateA = new Date(String(firstValue)).getTime();
        const dateB = new Date(String(secondValue)).getTime();
        return sortDescriptor.direction === "descending"
          ? dateB - dateA
          : dateA - dateB;
      }

      // Handle other numeric columns
      if (!isNaN(Number(firstValue)) && !isNaN(Number(secondValue))) {
        const firstNumeric = Number(firstValue);
        const secondNumeric = Number(secondValue);
        return sortDescriptor.direction === "descending"
          ? secondNumeric - firstNumeric
          : firstNumeric - secondNumeric;
      }
    }

    // Default string comparison
    const cmp = String(firstValue)
      .toLowerCase()
      .localeCompare(String(secondValue).toLowerCase());
    return sortDescriptor.direction === "descending" ? -cmp : cmp;
  });
};
