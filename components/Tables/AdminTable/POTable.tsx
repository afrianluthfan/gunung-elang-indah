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
import { useRouter } from "next/navigation";
import {
  calculateTotalPages,
  filterUsersByText,
  handleSearchChange,
  onRowsPerPageChange,
} from "@/app/utils/tableUtils";
import {
  columns,
  fetchPOData,
  ItemData,
  sortItems,
  statusColorMap,
  User,
} from "@/app/utils/poUtils";

export default function TableComponent() {
  const [users, setUsers] = useState<ItemData>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "tanggal",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchPOData(setUsers);
  }, []);

  const filteredUsers = React.useMemo(() => {
    return filterUsersByText(users, searchText, "nama_suplier");
  }, [users, searchText]);

  const sortedItems = React.useMemo(() => {
    return sortItems(filteredUsers, sortDescriptor);
  }, [sortDescriptor, filteredUsers]);

  const itemsWithIndex = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedItems.slice(start, start + rowsPerPage).map((item, index) => ({
      ...item,
      index: start + index + 1,
    }));
  }, [page, sortedItems, rowsPerPage]);

  const pages = calculateTotalPages(filteredUsers.length, rowsPerPage);

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
              color={statusColorMap[status]}
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
                      username === "admin"
                        ? `/purchase-order/edit?id=${user.id}`
                        : `/purchase-order/edit?id=${user.id}`,
                    )
                  }
                  className="cursor-pointer text-lg text-default-400 active:opacity-50"
                >
                  <EyeIcon className="items-center" />
                </span>
              </Tooltip>
              {user.status !== "DITERIMA" && username === "ADMIN" && (
                <Tooltip content="Edit" className="text-center text-black">
                  <span
                    onClick={() =>
                      router.push(
                        username === "ADMIN"
                          ? `/purchase-order/edit-admin?id=${user.id}`
                          : ``,
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
      <div className="mb-5 flex justify-between gap-4">
        <Input
          type="text"
          placeholder="Masukan Nama Supplier"
          value={searchText}
          onChange={(e) => handleSearchChange(e, setSearchText)}
        />
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
                className={`bg-blue-900 text-center text-white ${column.sortable ? "cursor-pointer" : ""} ${column.uid === "number" ? "w-1" : "w-32"}`}
                key={column.uid}
                align="start"
                allowsSorting={column.sortable}
              >
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
