"use client";

import React, { useCallback, useEffect, useState } from "react";
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
  Input,
  Button,
  Divider,
} from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { EyeIcon } from "./EyeIcon";
import axios from "axios";
import { useRouter } from "next/navigation";

const columns = [
  { name: "NO.", uid: "number" },
  { name: "TANGGAL", uid: "created_at", sortable: true },
  { name: "NAMA PERUSAHAAN", uid: "nama_company", sortable: true },
  { name: "NOMOR PI", uid: "invoice_number", sortable: true },
  { name: "TOTAL", uid: "total", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  DITERIMA: "success",
  DITOLAK: "danger",
  DIPROSES: "primary",
};

type User = {
  id: number;
  created_at: string;
  divisi: string;
  invoice_number: string;
  sub_total: string;
  total: string;
  status: string;
  nama_company: string;
};

export default function PITableComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterValue, setFilterValue] = useState("");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "created_at",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState<string>(""); // State for search text
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fetch username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("statusAccount");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    router.refresh();
  }, [router]);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/proforma-invoice/get-all-list-so`,
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

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = React.useMemo(() => {
    return users.filter((user) =>
      user.nama_company?.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [users, searchText]);

  const sortedItems = React.useMemo(() => {
    return [...filteredUsers].sort((a: User, b: User) => {
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
  }, [sortDescriptor, filteredUsers]);

  const itemsWithIndex = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedItems.slice(start, start + rowsPerPage).map((item, index) => ({
      ...item,
      index: start + index + 1,
    }));
  }, [page, sortedItems, rowsPerPage]);

  const pages = Math.ceil(filteredUsers.length / rowsPerPage);

  const renderCell = React.useCallback(
    (user: User & { index: number }, columnKey: React.Key) => {
      if (columnKey === "number") {
        return user.index;
      }

      const cellValue = user[columnKey as keyof User];
      switch (columnKey) {
        case "status":
          const status = user.status ? user.status.toUpperCase() : "UNKNOWN";
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[status] || "default"}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Details" className="text-center text-black">
                <span
                  onClick={() =>
                    router.push(
                      username === "SALES"
                        ? `/dokumen-logistik/detail-so-pi?id=${user.id}&divisi=${user.divisi}`
                        : `/dokumen-logistik/detail-so-pi?id=${user.id}&divisi=${user.divisi}`,
                    )
                  }
                  className="cursor-pointer text-lg text-default-400 active:opacity-50"
                >
                  <EyeIcon className="items-center" />
                </span>
              </Tooltip>
              {user.status !== "DITERIMA" && username === "SALES" && (
                <Tooltip content="Edit" className="text-center text-black">
                  <span
                    onClick={() =>
                      router.push(
                        username === "SALES"
                          ? `/proforma-invoice-dua/edit-sales?id=${user.id}&divisi=${user.divisi}`
                          : "",
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
    [username, router],
  );

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  const onClear = useCallback(() => {
    setFilterValue("")
    setPage(1)
  }, [])

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);


  return (
    <div>
      <div className="flex justify-between gap-4 mb-5">
        <Input
          isClearable
          className="w-full border-1 rounded-lg border-blue-900"
          placeholder="Cari Nama Suplier ..."
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
      </div>

      <div className="mb-5">
        <Divider />
      </div>

      <div>
        <Table
          removeWrapper
          aria-label="Purchase Order Table"
          className="overflow-x-scroll"
          isHeaderSticky
          isStriped
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                allowsSorting
                className="bg-[#0C295F] text-white text-center"
                align="start"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={"No Proforma Invoice found"}
            items={itemsWithIndex}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell className="items-center text-center">
                    {renderCell(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-5 flex justify-between">
        <Pagination
          total={pages}
          page={page}
          onChange={(newPage) => setPage(newPage)}
        />
        <select value={rowsPerPage} onChange={onRowsPerPageChange}>
          {[5, 10, 25, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize} per page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
