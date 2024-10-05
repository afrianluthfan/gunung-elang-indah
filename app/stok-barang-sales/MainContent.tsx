import { Button, Divider, Input } from "@nextui-org/react";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  SortDescriptor,
} from "@nextui-org/react";

type User = {
  kode: string;
  namaGudang: string;
  nama: string;
  qty: number;
  harga: string;
  variable: string;
};

const INITIAL_VISIBLE_COLUMNS = [
  "number",
  "variable",
  "nama",
  "qty",
  "harga",
  "kode",
  "namaGudang",
];

const MainContent = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [gudang, setGudang] = useState(""); // State untuk menyimpan pilihan gudang
  const [visibleColumns] = useState<Set<string>>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "nama",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk fetch data berdasarkan pilihan gudang
  const fetchData = useCallback(async () => {
    try {
      let response;
      if (gudang && gudang !== "0") {
        response = await axios.post(
          `http://localhost:8080/api/stok/listbygudang`,
          { id: gudang },
        );
      } else {
        response = await axios.post(
          "http://localhost:8080/api/stok/list-customer",
          {},
        );
      }
      setUsers(response.data.data);
    } catch (error) {
      setError("Error fetching data");
      console.error("Error fetching data:", error);
    }
  }, [gudang]); // Tambahkan `gudang` sebagai dependensi agar refetch ketika gudang berubah

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Panggil `fetchData` ketika komponen mount atau `gudang` berubah

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = [
    { name: "No", uid: "number" },
    { name: "Variable", uid: "variable" },
    { name: "Nama", uid: "nama" },
    { name: "Jumlah Barang", uid: "qty" },
    { name: "Katalog", uid: "kode" },
    { name: "Gudang", uid: "namaGudang" },
  ];

  const headerColumns = useMemo(() => {
    return columns.filter((column) => visibleColumns.has(column.uid));
  }, [columns, visibleColumns]);

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
      number: start + index + 1,
    }));
  }, [page, sortedItems, rowsPerPage]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const renderCell = useCallback(
    (user: User & { number: number }, columnKey: React.Key) => {
      const cellValue =
        columnKey === "number" ? user.number : user[columnKey as keyof User];

      return cellValue;
    },
    [],
  );

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  if (error) {
    return (
      <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
        <div className="flex w-full flex-col justify-between gap-4">
          <h1 className="mb-4 text-xl font-bold lg:text-[2vh]">Cari Barang</h1>
          <div className="flex w-full flex-col justify-stretch gap-4 text-sm lg:flex-row">
            <select
              name="Pilih Gudang"
              id="123"
              className="z-0 rounded-lg border border-blue-900 bg-white p-2 text-small text-black lg:z-50"
              value={gudang}
              onChange={(e) => setGudang(e.target.value)} // Set pilihan gudang
            >
              <option value="0">Pilih Gudang</option>
              <option value="1">Gudang Utama</option>
              <option value="2">Gudang Kedua</option>
              <option value="3">Gudang Ketiga</option>
            </select>
            <Input type="text" placeholder="Masukan ID Purchase Order" />
            <Button className="bg-[#00186D] font-bold text-white">
              Cari/Cek
            </Button>
          </div>
        </div>

        <div>Stok Barang Blm Ada</div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <div className="flex w-full flex-col justify-between gap-4">
        <h1 className="mb-4 text-xl font-bold lg:text-[2vh]">Cari Barang</h1>
        <div className="flex w-full justify-stretch gap-4 text-sm">
          <select
            name="Pilih Gudang"
            id="123"
            className="z-0 rounded-lg border border-blue-900 bg-white p-2 text-small text-black lg:z-50"
            value={gudang}
            onChange={(e) => setGudang(e.target.value)} // Set pilihan gudang
          >
            <option value="0">Semua Gudang</option>
            <option value="1">Gudang Utama</option>
            <option value="2">Gudang Kedua</option>
            <option value="3">Gudang Ketiga</option>
          </select>
          <Input type="text" placeholder="Masukan ID Purchase Order" />
          <Button className="bg-[#00186D] font-bold text-white">
            Cari/Cek
          </Button>
        </div>
      </div>

      <Divider />

      <div className="h-full overflow-x-scroll">
        <div className="text-sm">
          <Table
            aria-label="Example table with custom cells"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            removeWrapper
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align="start"
                  allowsSorting
                  className="bg-blue-900 text-white"
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              emptyContent={"Barang Tidak Ada Di Gudang Ini"}
              items={itemsWithIndex}
            >
              {(item) => (
                <TableRow key={item.number}>
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
      </div>
    </div>
  );
};

export default MainContent;
