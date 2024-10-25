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
  rumah_sakit: string;
};

export default function SOTableComponent({ selectedDocument }: { selectedDocument: string }) {
  const [users, setUsers] = useState<OrderData[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "tanggal",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const router = useRouter();
  const dispatch = useDispatch();

  const fetchData = async (endpoint: string, request: any = {}) => {
    try {
      const response = await axios.post(endpoint, request);
      setUsers(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setUsers([]);

    const role = localStorage.getItem("statusAccount");

    if (role === "ADMIN") {
      selectedDocument = "PI"
    } else if (role === "KEUANGAN") {
      selectedDocument = "PO"
    }
    
    if (selectedDocument === "PO" || selectedDocument === "PI") {
      console.log("Selected Document:", selectedDocument);
      const endpoint = selectedDocument === "PO" ? "http://209.182.237.155:8080/api/sales_order/list/finance" : "http://209.182.237.155:8080/api/sales_order/list/admin";
      const request = {
        dok : selectedDocument
      };  
      fetchData(endpoint, request);
    } 
  }, [selectedDocument]);

  const handleEditButton = useCallback(
    (id: number) => {
      const selectedOrder = users.find((user) => user.id === id);
      if (selectedOrder) {
        dispatch(setdetailSO(selectedOrder));
      }

      const role = localStorage.getItem("statusAccount");

      if (role === "ADMIN") {
        router.push(`/sales-order-sales/${id}`);
      } else if (role === "KEUANGAN") {
        router.push(`/sales-order-finance/${id}`);
      } else if (role === "LOGISTIK") {
        if (selectedDocument = "PI") {
          router.push(`/sales-order-sales/${id}`);
        } else if (selectedDocument = "PO") {
          router.push(`/sales-order-finance/${id}`);
        }
      }
      
    },
    [router, users, dispatch],
  );

  const sortedItems = React.useMemo(() => {
    return [...users].sort((a: OrderData, b: OrderData) => {
      const first = a[sortDescriptor.column as keyof OrderData] as string;
      const second = b[sortDescriptor.column as keyof OrderData] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, users]);

  const itemsWithIndex = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedItems.slice(start, start + rowsPerPage).map((item, index) => ({
      ...item,
      index: start + index + 1,
    }));
  }, [page, sortedItems, rowsPerPage]);

  const pages = Math.ceil(users.length / rowsPerPage);

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
          return <div>{user.rumah_sakit}</div>;
        case "total":
          return <div>{user.RP_total}</div>;
        default:
          if (Array.isArray(cellValue)) {
            return (
              <ul>
                {cellValue.map((item: any) => (
                  <li key={item.id}>
                    {item.nama_customer} - {item.quantity} - {item.harga_satuan}
                  </li>
                ))}
              </ul>
            );
          }
          return cellValue;
      }
    }, [handleEditButton],
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
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        removeWrapper
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn className="bg-[#0C295F] text-white" key={column.uid} align="start">
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"Silahkan pilih jenis dokumen dulu !"} items={itemsWithIndex}>
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
