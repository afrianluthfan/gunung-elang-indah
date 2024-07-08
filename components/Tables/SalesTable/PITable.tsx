"use client";

import React from "react";
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
} from "@nextui-org/react";
import { columns, users, statusOptions, fetchAllData } from "./data";
// import { DeleteIcon } from "./DeleteIcon";
// import { AcceptIcon } from "./AcceptIcon";
import { EditIcon } from "./EditIcon";
import { EyeIcon } from "../AdminTable/EyeIcon";

const statusColorMap: Record<string, ChipProps["color"]> = {
  diterima: "success",
  ditolak: "danger",
  diproses: "primary",
};

fetchAllData();

const INITIAL_VISIBLE_COLUMNS = [
  "number",
  "kat",
  "name",
  "qty",
  "hsatuan",
  "disc",
  "subtotal",
  "status",
  "actions",
];

type User = (typeof users)[0];

export default function PITableComponent() {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });

  //NO, TANGGAL, NAMA PT, JATUH TEMPO, TOTAL(RUPIAH)

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    return filteredUsers;
  }, [hasSearchFilter, statusFilter, filterValue]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a: User, b: User) => {
      const first = a[sortDescriptor.column as keyof User] as number;
      const second = b[sortDescriptor.column as keyof User] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const itemsWithIndex = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedItems.slice(start, start + rowsPerPage).map((item, index) => ({
      ...item,
      index: start + index + 1,
    }));
  }, [page, sortedItems, rowsPerPage]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const renderCell = React.useCallback(
    (user: User & { index: number }, columnKey: React.Key) => {
      if (columnKey === "number") {
        return user.index;
      }

      const cellValue = user[columnKey as keyof User];
      switch (columnKey) {
        case "name":
          return cellValue;
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
          switch (user.status) {
            case "diterima":
              return (
                <div className="relative flex items-center gap-2">
                  <Tooltip content="Details" className="text-black">
                    <span className="cursor-pointer text-lg text-default-400 active:opacity-50">
                      <EyeIcon />
                    </span>
                  </Tooltip>
                </div>
              );
            default:
              return (
                <div className="relative flex items-center gap-2">
                  <Tooltip content="Details" className="text-black">
                    <span className="cursor-pointer text-lg text-default-400 active:opacity-50">
                      <EyeIcon />
                    </span>
                  </Tooltip>
                  <Tooltip content="Edit user" className="text-black">
                    <span className="cursor-pointer text-lg text-default-400 active:opacity-50">
                      <EditIcon />
                    </span>
                  </Tooltip>
                </div>
              );
          }

        // <div className="relative flex items-center gap-2">
        //   <Tooltip
        //     color="success"
        //     content="Accept order"
        //     className="text-white"
        //   >
        //     <span className="cursor-pointer text-lg text-default-400 active:opacity-50">
        //       <AcceptIcon />
        //     </span>
        //   </Tooltip>
        //   <Tooltip color="danger" content="Delete order">
        //     <span className="cursor-pointer text-lg text-danger active:opacity-50">
        //       <DeleteIcon />
        //     </span>
        //   </Tooltip>
        //   <Tooltip content="Edit order" className="text-black">
        //     <span className="cursor-pointer text-lg text-default-400 active:opacity-50">
        //       <EditIcon />
        //     </span>
        //   </Tooltip>
        // </div>

        default:
          return cellValue;
      }
    },
    [],
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
        aria-label="Example table with custom cells"
        selectionMode="multiple"
        onSelectionChange={setSelectedKeys}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn key={column.uid} align="start">
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
