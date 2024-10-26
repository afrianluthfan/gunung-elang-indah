"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  Input,
  Button,
  Divider,
} from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { EyeIcon } from "./EyeIcon";
import { useRouter } from "next/navigation";
import {
  calculateTotalPages,
  filterUsersByText,
  handleSearchChange,
  onRowsPerPageChange,
} from "@/app/utils/tableUtils";
import {
  fetchSOData,
  sortItems,
  User,
  columns,
  statusColorMap,
} from "@/app/utils/soUtils";

export default function PITableComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "created_at",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState<string>("");
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

  useEffect(() => {
    fetchSOData(setUsers);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchText, sortDescriptor]);

  const filteredUsers = useMemo(() => {
    return filterUsersByText(users, searchText, "nama_company");
  }, [users, searchText]);

  const sortedItems = useMemo(() => {
    return sortItems(filteredUsers, sortDescriptor);
  }, [sortDescriptor, filteredUsers]);

  const totalItems = sortedItems.length;
  const pages = calculateTotalPages(totalItems, rowsPerPage);

  const itemsWithIndex = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedItems.slice(start, start + rowsPerPage).map((item, index) => ({
      ...item,
      index: start + index + 1,
    }));
  }, [page, rowsPerPage, sortedItems]);

  const renderCell = React.useCallback(
    (user: User & { index: number }, columnKey: React.Key) => {
      if (columnKey === "number") return user.index;

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
              <Tooltip content="Details">
                <div
                  onClick={() =>
                    router.push(
                      `/sales-order-sales/edit?id=${user.id}&divisi=${user.divisi}`,
                    )
                  }
                  className="cursor-pointer text-lg text-default-400 active:opacity-50"
                >
                  <EyeIcon />
                </div>
              </Tooltip>
              {user.status !== "DITERIMA" && username === "SALES" && (
                <Tooltip content="Edit">
                  <span
                    onClick={() =>
                      router.push(
                        `/proforma-invoice-dua/edit-sales?id=${user.id}&divisi=${user.divisi}`,
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

  return (
    <div>
      <Input
        type="text"
        placeholder="Masukan Nama Perusahaan"
        value={searchText}
        onChange={(e) => handleSearchChange(e, setSearchText)}
        className="mb-5"
      />

      <Divider className="mb-5" />

      <Table
        removeWrapper
        aria-label="Proforma Invoice Table"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              allowsSorting={column.sortable}
              className="bg-blue-900 text-center text-white"
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={itemsWithIndex}
          emptyContent="No Proforma Invoice found"
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell className="text-center">
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="mt-5 flex justify-between">
        {totalItems > rowsPerPage && (
          <>
            <Pagination
              total={pages}
              page={page}
              onChange={(newPage) => setPage(newPage)}
            />
            <select
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(e, setRowsPerPage, setPage)}
            >
              {[5, 10, 25, 50].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
          </>
        )}
      </div>
    </div>
  );
}
