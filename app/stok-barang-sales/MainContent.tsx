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
  lots: string;
};

const INITIAL_VISIBLE_COLUMNS = [
  "number",
  "variable",
  "lots",
  "nama",
  "qty",
  "harga",
  "kode",
  "namaGudang",
];

type Gudang = {
  id: number;
  nama_gudang: string;
  alamat_gudang: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const MainContent = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [gudang, setGudang] = useState("");
  const [visibleColumns] = useState<Set<string>>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "nama",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [gudangList, setGudangList] = useState<Gudang[]>([]);

  useEffect(() => {
    const fetchGudangList = async () => {
      try {
        const response = await axios.post(`${apiUrl}/gudang/list`);
        setGudangList(response.data.data);
      } catch (error) {
        setError("Error fetching Gudang list");
        console.error("Error fetching Gudang list:", error);
      }
    };

    fetchGudangList();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      let response;
      if (gudang && gudang !== "0") {
        response = await axios.post(`${apiUrl}/stok/listbygudang`, { id: gudang });
      } else {
        response = await axios.post(`${apiUrl}/stok/list-customer`, {});
      }
      setUsers(response.data.data);
    } catch (error) {
      setError("Error fetching data");
      console.error("Error fetching data:", error);
    }
  }, [gudang]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    { name: "No", uid: "number" },
    { name: "Variable", uid: "variable" },
    { name: "Lots", uid: "lots" },
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
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <div className="flex w-full flex-col justify-between gap-4">
        <h1 className="mb-4 text-xl font-bold lg:text-[2vh]">Cari Data</h1>
        <div className="flex w-full justify-stretch gap-4 text-sm">
          <select
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setGudang(e.target.value);
            }}
            name="gudang"
            className="w-full px-5 py-4 border border-black-500 rounded resize-none"
          >
            <option value="">Pilih Gudang Asal</option>
            {gudangList.map((gudang) => (
              <option key={gudang.id} value={gudang.id}>
                {gudang.nama_gudang}
              </option>
            ))}
          </select>
          <Input
            type="text"
            className="border-blue-900 rounded-xl"
            placeholder="Masukan Nama Barang"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)} // Update filterValue setiap kali ada perubahan di input
          />
        </div>
      </div>

      <Divider />

      <div className="h-full ">
        <div className="text-sm">
          <Table
            aria-label="Example table with custom cells"
            className="overflow-x-scroll"
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
                  className="bg-[#0C295F] text-white"
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
              showControls
              showShadow
              color="primary"
              page={page}
              onChange={setPage}
              total={pages}
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
        <div>
          <hr className="border-t-2 border-gray-300 my-4" />
          <h1 className="text-sm mb-4 text-center">© License held by PT Gunung Elang Indah</h1>
        </div>
      </div>

    </div>
  );
};

export default MainContent;
