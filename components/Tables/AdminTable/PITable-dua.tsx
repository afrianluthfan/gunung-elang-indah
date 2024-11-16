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
  { name: "STATUS", uid: "status", sortable: true },
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
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "created_at",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  // State untuk filter setiap kolom
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    nama_company: "",
    invoice_number: "",
    total: "",
    status: "",

  });

  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("statusAccount");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    router.refresh();
  }, [router]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/proforma-invoice/get-all-list`
      );
      console.log("API response:", response.data);
      if (response.data.status) {
        setUsers(response.data.data);
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
    return users.filter((user) => {
      const userDate = new Date(user.created_at);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      const isWithinDateRange =
        (!startDate || userDate >= startDate) && (!endDate || userDate <= endDate);

      return (
        isWithinDateRange &&
        user.nama_company
          ?.toLowerCase()
          .includes(filters.nama_company.toLowerCase()) &&
        user.invoice_number
          ?.toLowerCase()
          .includes(filters.invoice_number.toLowerCase()) &&
        user.total?.toLowerCase().includes(filters.total.toLowerCase()) &&


        user.status?.toLowerCase().includes(filters.status.toLowerCase())
      );
    });
  }, [users, filters]);

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
                        ? `/proforma-invoice-dua/edit?id=${user.id}&divisi=${user.divisi}`
                        : `/proforma-invoice-dua/edit?id=${user.id}&divisi=${user.divisi}`
                    )
                  }
                  className="cursor-pointer text-lg text-default-400 active:opacity-50"
                >
                  <EyeIcon className="items-center" />
                </span>
              </Tooltip>
              {user.status !== "Diterima" && username === "SALES" && (
                <Tooltip content="Edit" className="text-center text-black">
                  <span
                    onClick={() =>
                      router.push(
                        username === "SALES"
                          ? `/proforma-invoice-dua/edit-sales?id=${user.id}&divisi=${user.divisi}`
                          : ""
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
    [username, router]
  );

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const handleFilterChange = (columnKey: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [columnKey]: value,
    }));
  };

  return (
    <div>
      <div className="mb-5">
        <Divider />
      </div>
      <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row">
        <div className="flex gap-2">
          <Input
            type="date"
            placeholder="Start Date"
            className="border-1 border-blue-900 rounded-xl"
            value={filters.startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
          />
          <Input
            type="date"
            placeholder="End Date"
            className="border-1 border-blue-900 rounded-xl"
            value={filters.endDate}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
          />
        </div>
        <Input
          type="text"
          placeholder="Filter Nama Perusahaan"
          className="border-1 border-blue-900 rounded-xl"
          value={filters.nama_company}
          onChange={(e) => handleFilterChange("nama_company", e.target.value)}
        />
        <Input
          type="text"
          placeholder="Filter Nomor PI"

          className="border-1 border-blue-900 rounded-xl"
          value={filters.invoice_number}



          onChange={(e) => handleFilterChange("invoice_number", e.target.value)}
        />
        <Input
          type="text"
          placeholder="Filter Total"

          className="border-1 border-blue-900 rounded-xl"
          value={filters.total}
          onChange={(e) => handleFilterChange("total", e.target.value)}
        />

        <Input
          type="text"
          placeholder="Filter Status"

          className="border-1 border-blue-900 rounded-xl"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
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
                className="bg-[#0C295F] text-left text-white"
                key={column.uid}
                allowsSorting
                align="start"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={"No Data Available"}
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
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Pagination
          showControls
          showShadow
          color="primary"
          page={page}
          onChange={setPage}
          total={pages}
        />
        <div className="flex items-center gap-4">
          <label className="text-small text-default-500">Rows per page:</label>
          <select
            className="rounded-lg border border-default-200 bg-default-100 p-1 text-small text-default-900 outline-none focus:border-primary data-[hover=true]:cursor-pointer data-[hover=true]:bg-default-200"
            onChange={onRowsPerPageChange}
          >
            {[5, 10, 15, 25, 50].map((rows) => (
              <option key={rows} value={rows}>
                {rows}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
