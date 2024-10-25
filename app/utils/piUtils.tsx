import axios from "axios";
import { SortDescriptor } from "@nextui-org/react";

export type User = {
  id: number;
  created_at: string;
  divisi: string;
  invoice_number: string;
  sub_total: string;
  total: string;
  status: string;
  nama_company: string;
};

export const fetchDataPI = async (
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
) => {
  try {
    const response = await axios.post(
      "http://209.182.237.155:8080/api/proforma-invoice/get-all-list",
    );
    console.log("API response:", response.data);
    if (response.data.status) {
      setUsers(response.data.data);
      console.log("Users set:", response.data.data);
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
      // Special handling for status column
      if (sortDescriptor.column === "status") {
        const cmp = String(firstValue).localeCompare(String(secondValue));
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }

      // Handle numeric columns (total, etc.)
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
