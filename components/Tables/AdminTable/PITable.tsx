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
} from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { EyeIcon } from "./EyeIcon";
import axios from "axios";

const columns = [
  { name: "NO.", uid: "number" },
  { name: "ID", uid: "id", sortable: true },
  { name: "KAT.", uid: "kat" },
  { name: "NAMA BARANG", uid: "name", sortable: true },
  { name: "QTY", uid: "qty", sortable: true },
  { name: "H. SATUAN", uid: "hsatuan", sortable: true },
  { name: "DISC", uid: "disc" },
  { name: "SUBTOTAL", uid: "subtotal", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  Diterima: "success",
  Ditolak: "danger",
  Diproses: "primary",
};

type ItemData = {
  id: number;
  kat: string;
  name: string;
  qty: string;
  hsatuan: string;
  disc: string;
  subtotal: string;
  status: string;
}[];

type User = ItemData[0];

export default function PITableComponent() {
  const [users, setUsers] = useState<ItemData>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const fetchItemData1 = async () => {
    try {
      const response = await axios.post(
        "http://209.182.237.155:8080/api/proforma-invoice/get-all-list",
        "",
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data from API 1", error);
      return [];
    }
  };

  const fetchItemData2 = async () => {
    try {
      const response = await axios.post(
        "http://209.182.237.155:8080/api/stock-barang/list",
        "",
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data from API 2", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      const data1 = await fetchItemData1();
      const data2 = await fetchItemData2();

      if (!Array.isArray(data1) || !Array.isArray(data2)) {
        console.error("Unexpected data format", { data1, data2 });
        return;
      }

      const mergedData = data1.map((item1) => {
        const item2 = data2.find((item2) => item2.id === item1.id);
        return {
          id: item1.id,
          kat: item1.divisi,
          name: item2?.name || "",
          qty: "N/A", // Assuming qty is not available in the provided data
          hsatuan: item2?.price || "",
          disc: "N/A", // Assuming disc is not available in the provided data
          subtotal: item1.sub_total,
          status: item1.status,
        };
      });

      setUsers(mergedData);
    };

    fetchAllData();
  }, []);

  const sortedItems = React.useMemo(() => {
    return [...users].sort((a: User, b: User) => {
      const first = a[sortDescriptor.column as keyof User] as number;
      const second = b[sortDescriptor.column as keyof User] as number;
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
          return (
            <div className="relative flex items-center justify-center gap-2">
              <Tooltip content="Details" className="text-black">
                <span className="cursor-pointer text-lg text-default-400 active:opacity-50">
                  <EyeIcon />
                </span>
              </Tooltip>
              {user.status !== "diterima" && (
                <Tooltip content="Edit user" className="text-black">
                  <span className="cursor-pointer text-lg text-default-400 active:opacity-50">
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
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={columns}>
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
