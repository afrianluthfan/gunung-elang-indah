"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Tooltip,
  Divider,
} from "@nextui-org/react";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
import { EditIcon } from "./EditIcon";
import Swal from "sweetalert2";

const statusColorMap: Record<string, ChipProps["color"]> = {
  paid: "success",
  unpaid: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "number",
  "tanggal",
  "nama",
  "nominal",
  "pajak",
  "amount",
  "actions",
];

type User = {
  id: number;
  nama: string;
  nominal: string;
  amount: string;
  tanggal: string;
};

export default function TableComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "descending",
  });
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  let Total = ""

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://209.182.237.155:8080/api/piutang/list",
          {},
        );
        Total = response.data.total
        setUsers(response.data.data);
      } catch (error) {
        setError("Error fetching data");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleMarkAsPaid = async (id: number) => {
    // Konfirmasi menggunakan SweetAlert2
    const result = await Swal.fire({
      title: "Apakah kamu yakin?",
      text: `Kamu akan melunasi user dengan ID ${id}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, lunasi!",
      cancelButtonText: "Batal",
    });
  
    // Jika user mengkonfirmasi, lanjutkan ke API request
    if (result.isConfirmed) {
      try {
        const response = await axios.post("http://209.182.237.155:8080/api/piutang/lunas", {
          id: id,
        });
  
        Swal.fire(
          "Berhasil!",
          `User dengan ID ${id} berhasil dilunasi.`,
          "success"
        );

        try {
          const response = await axios.post(
            "http://209.182.237.155:8080/api/hutang/list",
            {},
          );
          Total = response.data.total
          setUsers(response.data.data);
        } catch (error) {
          setError("Error fetching data");
          console.error("Error fetching data:", error);
        }

      } catch (error) {
        console.error("Error marking user as paid:", error);
  
        Swal.fire(
          "Gagal!",
          `Gagal melunasi user dengan ID ${id}.`,
          "error"
        );
      }
    }
  }
  const columns = [
    { name: "No", uid: "number" },
    { name: "Tanggal", uid: "tanggal" },
    { name: "Nama", uid: "nama" },
    { name: "Nominal", uid: "nominal" },
    { name: "Pajak", uid: "pajak" },
    { name: "Amount", uid: "amount" },
    { name: "Actions", uid: "actions" }
  ];

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = Array.isArray(users) ? [...users] : [];

    if (filterValue) {
      filteredUsers = filteredUsers.filter((user) =>
        user.nama.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredUsers;
  }, [filterValue, users]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: User, b: User) => {
      const first = a[sortDescriptor.column as keyof User] as string | number;
      const second = b[sortDescriptor.column as keyof User] as string | number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const itemsWithIndex = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedItems.slice(start, start + rowsPerPage).map((item, index) => ({
      ...item,
      index: start + index + 1,
    }));
  }, [page, sortedItems, rowsPerPage]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const renderCell = useCallback(
    (user: User & { index: number }, columnKey: React.Key) => {
      if (columnKey === "number") {
        return user.index;
      }

      const cellValue = user[columnKey as keyof User];
      switch (columnKey) {
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip color="success" content="Mark as Paid">
                <span
                  className="cursor-pointer text-lg text-success active:opacity-50"
                  onClick={() => handleMarkAsPaid(user.id)}
                >
                  {/* Replace CheckIcon with an appropriate icon or import it */}
                  ✓
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },    [],
  );

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>

      <Table
        aria-label="Example table with custom cells"
        
        onSelectionChange={setSelectedKeys}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        removeWrapper
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn className="bg-blue-900 text-white" key={column.uid} align="start">
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
