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
  { name: "TANGGAL", uid: "tanggal", sortable: true },
  { name: "NAMA SUPLIER", uid: "nama_suplier", sortable: true },
  { name: "NOMOR PO", uid: "nomor_po", sortable: true },
  { name: "SUB TOTAL", uid: "sub_total", sortable: true },
  { name: "TOTAL (PPN)", uid: "total", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
  const [searchText, setSearchText] = useState<string>("");

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    nama_suplier: "",
    nomor_po: "",
    sub_total: "",
    total: "",
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
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.post(`${apiUrl}/purchase-order/list`);
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
      const userDate = new Date(user.tanggal.split('-').reverse().join('-'));
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      const dateInRange = (!startDate || userDate >= startDate) && (!endDate || userDate <= endDate);

      return dateInRange &&
        user.nama_suplier.toLowerCase().includes(filters.nama_suplier.toLowerCase()) &&
        user.nomor_po.toLowerCase().includes(filters.nomor_po.toLowerCase()) &&
        user.sub_total.toLowerCase().includes(filters.sub_total.toLowerCase()) &&
        user.total.toLowerCase().includes(filters.total.toLowerCase()) &&
        user.nama_suplier.toLowerCase().includes(searchText.toLowerCase());
    });
  }, [users, filters, searchText]);

  const sortedItems = React.useMemo(() => {
    return [...filteredUsers].sort((a: User, b: User) => {
      const first = a[sortDescriptor.column as keyof User] ?? "";
      const second = b[sortDescriptor.column as keyof User] ?? "";

      if (sortDescriptor.column === "sub_total" || sortDescriptor.column === "total" || sortDescriptor.column === "pajak") {
        const firstValue = parseInt(String(first).replace(/[^0-9]/g, ""));
        const secondValue = parseInt(String(second).replace(/[^0-9]/g, ""));
        return sortDescriptor.direction === "descending" ? secondValue - firstValue : firstValue - secondValue;
      }

      const cmp = String(first).localeCompare(String(second));
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
              <Tooltip content="Details" className="text-black text-center">
                <span
                  onClick={() =>
                    router.push(`/purchase-order/edit?id=${user.id}`)
                  }
                  className="cursor-pointer text-lg text-default-400 active:opacity-50">
                  <EyeIcon className="items-center" />
                </span>
              </Tooltip>
              {user.status !== "DITERIMA" && username === "ADMIN" && (
                <Tooltip content="Edit" className="text-black text-center">
                  <span
                    onClick={() =>
                      router.push(`/purchase-order/edit-admin?id=${user.id}`)
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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <div>
      <div className="mb-5">
        <Divider />
      </div>

      <div className="flex gap-2 mb-5">
        <Input 
          type="date" 
          className="border-1 border-blue-900 rounded-xl" 
          placeholder="Start Date" 
          name="startDate" 
          onChange={handleFilterChange} 
        />
        <Input 
          type="date" 
          className="border-1 border-blue-900 rounded-xl" 
          placeholder="End Date" 
          name="endDate" 
          onChange={handleFilterChange} 
        />
        <Input className="border-1 border-blue-900 rounded-xl" placeholder="Nama Suplier" name="nama_suplier" onChange={handleFilterChange} />
        <Input className="border-1 border-blue-900 rounded-xl" placeholder="Nomor PO" name="nomor_po" onChange={handleFilterChange} />
        <Input className="border-1 border-blue-900 rounded-xl" placeholder="Sub Total" name="sub_total" onChange={handleFilterChange} />
        <Input className="border-1 border-blue-900 rounded-xl" placeholder="Total" name="total" onChange={handleFilterChange} />
      </div>

      <div className="mb-5">
        <Divider />
      </div>

      <div>
        <Table
          removeWrapper
          aria-label="Purchase Order Table"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                allowsSorting
                className="bg-[#0C295F] text-white text-left"
                align="start">
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
                  <TableCell className="text-left items-center">{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-5 flex justify-between">
        <Pagination
          showControls
          showShadow
          color="primary"
          page={page}
          onChange={setPage}
          total={pages}
        />
        <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
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
