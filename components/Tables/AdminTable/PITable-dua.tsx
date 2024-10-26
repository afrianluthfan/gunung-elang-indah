"use client";

import React, { useEffect, useState } from "react";
import { EditIcon } from "./EditIcon";
import { EyeIcon } from "./EyeIcon";
import { useRouter } from "next/navigation";
import { User, fetchDataPI, sortItems } from "@/app/utils/piUtils";
import {
  calculateTotalPages,
  filterUsersByText,
  handleSearchChange,
  onRowsPerPageChange,
} from "@/app/utils/tableUtils";
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

export default function PITableComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "nama_company",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState<string>(""); // State for search text
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

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

  useEffect(() => {
    fetchDataPI(setUsers);
  }, []);

  const filteredUsers = React.useMemo(() => {
    return filterUsersByText(users, searchText, "nama_company");
  }, [users, searchText]);

  const pages = calculateTotalPages(filteredUsers.length, rowsPerPage);
  const sortedItems = React.useMemo(() => {
    return sortItems(filteredUsers, sortDescriptor);
  }, [sortDescriptor, filteredUsers]);

  const itemsWithIndex = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedItems // Changed from users to filteredUsers
      .slice(start, start + rowsPerPage)
      .map((item: any, index: number) => ({
        ...item,
        index: start + index + 1,
      }));
  }, [page, rowsPerPage, sortedItems]); // Changed dependency from users to filteredUsers

  const renderCell = React.useCallback(
    (user: User & { index: number }, columnKey: React.Key) => {
      if (columnKey === "number") {
        return user.index;
      }

      const cellValue = user[columnKey as keyof User];
      const titleCased = cellValue?.toString().replace(/_/g, " ").toUpperCase();

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
              {titleCased}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center justify-center gap-2">
              <Tooltip content="Details" className="text-center text-black">
                <span
                  onClick={() =>
                    router.push(
                      username === "SALES"
                        ? `/proforma-invoice-dua/edit?id=${user.id}&divisi=${user.divisi}`
                        : `/proforma-invoice-dua/edit?id=${user.id}&divisi=${user.divisi}`,
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

  const handleSortChange = (columnId: string) => {
    if (sortDescriptor.column === columnId) {
      const newDirection =
        sortDescriptor.direction === "ascending" ? "descending" : "ascending";
      setSortDescriptor({
        column: columnId,
        direction: newDirection,
      });
    } else {
      setSortDescriptor({
        column: columnId,
        direction: "ascending",
      });
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row">
        <Input
          type="text"
          placeholder="Masukkan Nama Perusahaan"
          value={searchText}
          onChange={(e) => {
            handleSearchChange(e, setSearchText);
          }}
        />
      </div>

      <div className="mb-5">
        <Divider />
      </div>

      <div>
        <Table
          removeWrapper
          aria-label="Purchase Order Table"
          className="grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] overflow-x-scroll" // Add grid classes
          isHeaderSticky
          isStriped
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align="start"
                allowsSorting={column.sortable}
                tabIndex={0} // Makes the column header focusable
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSortChange(column.uid);
                  }
                }}
                className={`bg-blue-900 text-center text-white ${column.sortable ? "cursor-pointer" : ""} ${column.uid === "number" ? "w-1" : "w-32"}`}
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
                  <TableCell className="max-w-32 items-center text-center">
                    {renderCell(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-5 flex justify-between">
        <div>
          {sortedItems.length > rowsPerPage && (
            <Pagination
              total={pages}
              page={page}
              onChange={(newPage) => setPage(newPage)}
            />
          )}
        </div>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(e, setRowsPerPage, setPage)}
        >
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
