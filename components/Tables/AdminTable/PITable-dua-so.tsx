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
import { DeleteIcon } from "../../icon/DeleteIcon";
import Swal from "sweetalert2";

const columns = [
  { name: "NO.", uid: "number" },
  { name: "TANGGAL", uid: "created_at", sortable: true },
  { name: "NAMA PERUSAHAAN", uid: "nama_company", sortable: true },
  { name: "NOMOR PI", uid: "invoice_number", sortable: true },
  { name: "TOTAL", uid: "total", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusColorMap = {
  DITERIMA: "success",
  DITOLAK: "danger",
  DIPROSES: "primary",
  DIBATALKAN: "danger",
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

  const [filters, setFilters] = useState({
    nama_company: "",
    invoice_number: "",
    total: "",
    status: "",
    startDate: "",
    endDate: "",
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

  const getAllListSO = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/proforma-invoice/get-all-list-so`
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
    getAllListSO();
  }, []);

  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      const date = new Date(user.created_at);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      const isWithinDateRange =
        (!startDate || date >= startDate) &&
        (!endDate || date <= endDate);

      return (
        user.nama_company
          ?.toLowerCase()
          .includes(filters.nama_company.toLowerCase()) &&
        user.invoice_number
          ?.toLowerCase()
          .includes(filters.invoice_number.toLowerCase()) &&
        user.total?.toLowerCase().includes(filters.total.toLowerCase()) &&
        user.status?.toLowerCase().includes(filters.status.toLowerCase()) &&
        isWithinDateRange
      );
    });
  }, [users, filters]);

  const sortedItems = React.useMemo(() => {
    return [...filteredUsers].sort((a: User, b: User) => {
      const column = sortDescriptor.column as keyof User;

      // Handle date sorting
      if (column === 'created_at') {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortDescriptor.direction === "descending"
          ? dateB - dateA
          : dateA - dateB;
      }

      // Handle total amount sorting
      if (column === 'total') {
        const valueA = Number(a.total?.replace(/[^0-9]/g, '')) || 0;
        const valueB = Number(b.total?.replace(/[^0-9]/g, '')) || 0;
        return sortDescriptor.direction === "descending"
          ? valueB - valueA
          : valueA - valueB;
      }

      // Handle sub_total sorting
      if (column === 'sub_total') {
        const valueA = Number(a.sub_total) || 0;
        const valueB = Number(b.sub_total) || 0;
        return sortDescriptor.direction === "descending"
          ? valueB - valueA
          : valueA - valueB;
      }

      // Default string sorting for other columns
      const valueA = String(a[column] || '').toLowerCase();
      const valueB = String(b[column] || '').toLowerCase();

      return sortDescriptor.direction === "descending"
        ? valueB.localeCompare(valueA)
        : valueA.localeCompare(valueB);
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
              color={statusColorMap[status as keyof typeof statusColorMap] as "success" | "danger" | "primary" | "default" | "secondary" | "warning"}
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
                <span
                  onClick={() =>
                    router.push(
                      username === "SALES"
                        ? `/sales-order-sales/edit?id=${user.id}&divisi=${user.divisi}`
                        : `/sales-order-sales/edit?id=${user.id}&divisi=${user.divisi}`,
                    )
                  }
                  className="cursor-pointer text-lg text-default-400 active:opacity-50"
                >
                  <EyeIcon />
                </span>
              </Tooltip>
              {user.status !== "DITERIMA" && username === "SALES" && (
                <Tooltip content="Edit">
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
              {username === "ADMIN" && (
                <Tooltip content="Delete" className="text-black">
                  <span
                    onClick={() =>
                      deleteUser(user.id) // Assuming deleteUser is the function to call the delete API
                    }
                    className="cursor-pointer text-lg text-default-400 active:opacity-50"
                  >
                    <DeleteIcon />
                  </span>
                </Tooltip>
              )}
            </div>
          );
        default:
          return cellValue;
      }
    }, [username, router],
  );


  const deleteUser = async (id: number) => {
    const confirmDelete = await Swal.fire({
      title: 'Konfirmasi Pembatalan',
      text: 'Apakah Anda yakin ingin membatalkan?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, batalkan!',
      cancelButtonText: 'Tidak, kembali'
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await axios.post(`${apiUrl}/proforma-invoice/cancel`, {
          id: id,
        });
        if (response.status !== 200) {
          throw new Error('Failed to delete user');
        } else {
          await getAllListSO(); // Call the API to refresh the data
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };
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
                className="bg-[#0C295F] text-center text-white"
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
            {[5, 10, 15, 20].map((rows) => (
              <option key={rows} value={rows}>
                {rows}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <hr className="border-t-2 border-gray-300 my-4" />
        <h1 className="text-sm mb-4 text-center">© License held by PT Gunung Elang Indah</h1>
      </div>
    </div>
  );
}
