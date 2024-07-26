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
  { name: "NAMA SUPLIER", uid: "nama_suplier", sortable: true },
  { name: "NOMOR PO", uid: "nomor_po", sortable: true },
  { name: "SUB TOTAL", uid: "sub_total", sortable: true },
  { name: "TOTAL", uid: "total", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  DITERIMA: "success",
  DITOLAK: "danger",
  DIPROSES: "primary",
};

type ItemData = {
  id: number;
  tanggal: string;
  nama_suplier: string;
  nomor_po: string;
  sub_total: string;
  total: string;
  status: string;
}[];

type User = ItemData[0];

export default function PITableComponent() {
  const [users, setUsers] = useState<ItemData>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "tanggal",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  const namaUser = localStorage.getItem("username");
  useEffect(() => {
    const fetchData = async () => {
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

    // const fetchPersistedData = () => {
    //   const persistedData = localStorage.getItem("persist:root");
    //   if (persistedData) {
    //     try {
    //       const parsedData = JSON.parse(persistedData);
    //       const authData = parsedData.auth && JSON.parse(parsedData.auth.value);
    //       if (authData) {
    //         setUsername(authData.username);
    //       }
    //     } catch (error) {
    //       console.error("Failed to parse persisted data:", error);
    //     }
    //   }
    // };

    // fetchPersistedData();

    fetchData();
  }, []);

  const sortedItems = React.useMemo(() => {
    return [...users].sort((a: User, b: User) => {
      const first =
        a[sortDescriptor.column as keyof User] !== undefined
          ? String(a[sortDescriptor.column as keyof User])
          : "";
      const second =
        b[sortDescriptor.column as keyof User] !== undefined
          ? String(b[sortDescriptor.column as keyof User])
          : "";

      // Ensure both values are strings before comparing
      const cmp = first.localeCompare(second);

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
              {user.status !== "DITERIMA" && (
                <Tooltip content="Edit" className="text-black">
                  <span
                    onClick={() =>
                      router.push(
                        namaUser === "admin"
                          ? `/purchase-order/edit-admin?id=${user.id}`
                          : `/purchase-order/edit?id=${user.id}`,
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
    [namaUser, router],
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
        aria-label="Purchase Order Table"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader  columns={columns}>
          {(column) => (
            <TableColumn className="bg-blue-900 text-white" key={column.uid} align="start">
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No purchase orders found"}
          items={itemsWithIndex}
        >
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
