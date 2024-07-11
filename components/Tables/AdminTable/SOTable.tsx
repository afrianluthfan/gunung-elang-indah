"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Selection,
  SortDescriptor,
  Tooltip,
} from "@nextui-org/react";
import axios from "axios";
import { EyeIcon } from "./EyeIcon";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setdetailSO } from "@/redux/features/detailSO-slice";

const columns = [
  { name: "NO.", uid: "number" },
  { name: "TANGGAL", uid: "tanggal", sortable: true },
  { name: "NAMA CUSTOMER", uid: "nama_customer", sortable: true },
  { name: "TOTAL", uid: "total", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

type OrderData = {
  id: number;
  customer_id: number;
  nama_customer: string;
  status: string;
  divisi: string;
  invoice_number: string;
  po_number: string;
  due_date: string;
  doctor_name: string;
  patient_name: string;
  tanggal_tindakan?: string;
  tanggal?: string;
  rm?: string;
  number_si?: string;
  RP_sub_total: string;
  RP_pajak_ppn: string;
  RP_total: string;
};

const INITIAL_VISIBLE_COLUMNS = [
  "number",
  "tanggal",
  "nama_customer",
  "total",
  "actions",
];

export default function SOTableComponent() {
  const [users, setUsers] = useState<OrderData[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const router = useRouter();
  const dispatch = useDispatch();

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/sales_order/list",
        "",
      );
      setUsers(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditButton = useCallback(
    (id: number) => {
      const selectedOrder = users.find((user) => user.id === id);
      if (selectedOrder) {
        dispatch(setdetailSO(selectedOrder));
      }
      router.push(`/sales-order/${id}`);
    },
    [router, users, dispatch],
  );

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
      filteredUsers = filteredUsers.filter(
        (user) =>
          user &&
          user.doctor_name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredUsers;
  }, [users, hasSearchFilter, filterValue]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a: OrderData, b: OrderData) => {
      const first = a[sortDescriptor.column as keyof OrderData] as number;
      const second = b[sortDescriptor.column as keyof OrderData] as number;
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
    (user: OrderData & { index: number }, columnKey: React.Key) => {
      if (columnKey === "number") {
        return user.index;
      }

      const cellValue = user[columnKey as keyof OrderData];
      switch (columnKey) {
        case "name":
          return cellValue;
        case "actions":
          return (
            <div
              className="relative flex items-center gap-2"
              onClick={() => handleEditButton(user.id)}
            >
              <Tooltip content="Details" className="text-black">
                <span className="cursor-pointer text-lg text-default-400 active:opacity-50">
                  <EyeIcon />
                </span>
              </Tooltip>
            </div>
          );

        case "tanggal":
          return <div>{user.tanggal}</div>;
        case "nama_customer":
          return <div>{user.nama_customer}</div>;
        case "total":
          return <div>{user.RP_total}</div>;
        default:
          if (Array.isArray(cellValue)) {
            return (
              <ul>
                {cellValue.map((item) => (
                  <li key={item.id}>
                    {item.nama_barang} - {item.quantity} - {item.harga_satuan}
                  </li>
                ))}
              </ul>
            );
          }
          return cellValue;
      }
    },
    [handleEditButton],
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
