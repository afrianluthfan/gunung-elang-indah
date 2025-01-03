"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  Input,
  Button,
} from "@nextui-org/react";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
import { EditIcon } from "./EditIcon";
import Swal from "sweetalert2";
// import { SearchIcon } from "./SearchIcon";

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
  pi_id: string;
  divisi: string;
};

export default function TableComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalHutang, setTotalHutang] = useState<string>("");
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

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  let Total = ""

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${apiUrl}/hutang/list`,
          {},
        );

        console.log("API Response:", response.data.total);
        setTotalHutang(response.data.total);
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
        const response = await axios.post(`${apiUrl}/hutang/lunas`, {
          id: id,
        });

        Swal.fire(
          "Berhasil!",
          `User dengan ID ${id} berhasil dilunasi.`,
          "success"
        );

        try {
          const response = await axios.post(
            `${apiUrl}/hutang/list`,
            {},
          );
          setTotalHutang(response.data.total);
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
      const first = a[sortDescriptor.column as keyof User] as string;
      const second = b[sortDescriptor.column as keyof User] as string;

      if (sortDescriptor.column === 'nominal' || sortDescriptor.column === 'pajak' || sortDescriptor.column === 'amount') {
        const firstValue = parseInt(first.replace(/[^0-9]/g, ''));
        const secondValue = parseInt(second.replace(/[^0-9]/g, ''));
        const cmp = firstValue < secondValue ? -1 : firstValue > secondValue ? 1 : 0;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }

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

  const router = useRouter();

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
              <Button
                color="success"
                className="cursor-pointer active:opacity-50 text-white"
                onClick={() => handleMarkAsPaid(user.id)}
              >
                Lunas
              </Button>

              <Button
                color="primary"
                className="cursor-pointer active:opacity-50 text-white"
                onClick={() =>
                  router.push(`/hutang/edit?id=${user.pi_id}`)
                }
              >
                Detail
              </Button>
            </div>
          );
        default:
          return cellValue;
      }
    }, [],
  );

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("")
    setPage(1)
  }, [])

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-bold text-sm mb-4">Data Hutang Pembelian</h1>
      </div>

      <Divider className="mb-4" />

      <div className="flex justify-between items-center gap-3 mb-3 w-full">
        <Input
          isClearable
          className="w-full border-1 rounded-lg border-blue-900"
          placeholder="Cari Nama Suplier ..."
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
      </div>



      <Divider className="my-4" />

      <div className="mb-4 background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
        <table border={10}>
          <tbody>
            <tr>
              <td className="font-semibold text-sm">
                Total Hutang Saat Ini
              </td>
              <td>
                :
              </td>
              <td className="text-sm">
                {totalHutang}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Divider className="my-4" />

      <Table
        aria-label="Example table with custom cells"
        onSelectionChange={setSelectedKeys}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        removeWrapper
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              allowsSorting
              className="bg-[#0C295F] text-white text-left"
              align="start"
            >
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
        {
          pages && (
            <Pagination
              showControls
              showShadow
              autoFocus={true}
              initialPage={1}
              color="primary"
              page={page}
              onChange={setPage}
              total={pages}
            />
          )
        }
        <select value={rowsPerPage} onChange={onRowsPerPageChange}>
          {[5, 10].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize} per page
            </option>
          ))}
        </select>
      </div>

      <div>
        <hr className="border-t-2 border-gray-300 my-4" />
        <h1 className="text-sm mb-4 text-center">© License held by PT Gunung Elang Indah</h1>
      </div>
    </div>
  );
}