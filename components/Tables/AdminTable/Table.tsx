"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  SortDescriptor,
  Tooltip,
  ChipProps,
} from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { EyeIcon } from "./EyeIcon";
import axios from "axios";
import { useRouter } from "next/navigation";

const columns = [
  { name: "NO.", uid: "number" },
  { name: "TANGGAL.", uid: "tanggal" },
  { name: "NAMA CUSTOMER", uid: "nama_customer", sortable: true },
  { name: "NAMA BARANG", uid: "name", sortable: true },
  { name: "JUMLAH ORDER", uid: "jumlah_order", sortable: true },
  { name: "TOTAL", uid: "total", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  Diterima: "success",
  Ditolak: "danger",
  Diproses: "primary",
};

type ItemData = {
  id: number;
  tanggal: string;
  nama_customer: string;
  name: string;
  jumlah_order: string;
  total: string;
  status: string;
  divisi: string;
}[];

type User = ItemData[0];

export default function PITableComponent() {
  const [users, setUsers] = useState<ItemData>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchItemData = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/proforma-invoice/get-all-list`,
        "",
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data from API", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      const data = await fetchItemData();

      if (!Array.isArray(data)) {
        console.error("Unexpected data format", { data });
        return;
      }

      setUsers(data);
    };

    fetchAllData();
  }, []);

  const sortedItems = React.useMemo(() => {
    return [...users].sort((a: User, b: User) => {
      const first = a[sortDescriptor.column as keyof User] as number;
      const second = b[sortDescriptor.column as keyof User] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, users]);

  const itemsWithIndex = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedItems.slice(start, start + rowsPerPage).map((item, index) => ({
      ...item,
      index: start + index + 1,
    }));
  }, [page, sortedItems, rowsPerPage]);

  const pages = Math.ceil(users.length / rowsPerPage);

  const renderCell = React.useCallback(
    (user: User & { index: number }, columnKey: React.Key) => {
      if (columnKey === "number") {
        return user.index;
      }

      const cellValue = user[columnKey as keyof User];
      switch (columnKey) {
        case "name":
          return cellValue;
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[user.status]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Details" className="text-black">
                <span className="cursor-pointer text-lg text-default-400 active:opacity-50">
                  <EyeIcon />
                </span>
              </Tooltip>
              {user.status !== "diterima" && (
                <Tooltip content="Edit user" className="text-black">
                  <span
                    onClick={() =>
                      router.push(
                        `/proforma-invoice/edit?id=${user.id}&divisi=${user.divisi}`,
                      )
                    }
                    className="cursor-pointer text-lg text-default-400 active:opacity-50"
                  >
                    <EditIcon />
                  </span>
                </Tooltip>
              )}
            </div>
          );
        default:
          return cellValue;
      }
    },
    [router],
  );

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  return (
    <div>
      <Table
        aria-label="Example table with custom cells"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align="start">
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No users found"} items={itemsWithIndex}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mt-5 flex justify-between">
        <Pagination
          total={pages}
          page={page}
          onChange={(newPage) => setPage(newPage)}
        />
        <select value={rowsPerPage} onChange={onRowsPerPageChange}>
          {[5, 10].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize} per page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
