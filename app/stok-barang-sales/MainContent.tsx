import { Button, Divider, Input } from "@nextui-org/react";
import React, { useEffect, useState, useCallback, useMemo } from "react";
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
import {
  fetchDataGudang,
  fetchGudangList,
  Gudang,
  StokBarang,
} from "../utils/stokBarangUtils";

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
  const [stokBarangs, setStokBarangs] = useState<StokBarang[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [gudang, setGudang] = useState(""); // State untuk menyimpan pilihan gudang
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [gudangList, setGudangList] = useState<Gudang[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "nama",
    direction: "ascending",
  });
  const [visibleColumns] = useState<Set<string>>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );

  useEffect(() => {
    fetchGudangList(setGudangList, setError);
  }, []);

  useEffect(() => {
    // Fungsi untuk fetch data berdasarkan pilihan gudang
    fetchDataGudang(gudang, setStokBarangs, setError);
  }, [gudang]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = [
    { name: "No", uid: "number", sortable: false },
    { name: "Variable", uid: "variable", sortable: true },
    { name: "Nama", uid: "nama", sortable: true },
    { name: "Jumlah Barang", uid: "qty", sortable: true },
    { name: "Katalog", uid: "kode", sortable: true },
    { name: "Gudang", uid: "namaGudang", sortable: true },
  ];

  const headerColumns = useMemo(() => {
    return columns.filter((column) => visibleColumns.has(column.uid));
  }, [columns, visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = Array.isArray(stokBarangs) ? [...stokBarangs] : [];

    if (filterValue) {
      filteredUsers = filteredUsers.filter((user) =>
        user.nama.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredUsers;
  }, [filterValue, stokBarangs]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: StokBarang, b: StokBarang) => {
      const first = a[sortDescriptor.column as keyof StokBarang] as
        | string
        | number;
      const second = b[sortDescriptor.column as keyof StokBarang] as
        | string
        | number;
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
    (user: StokBarang & { number: number }, columnKey: React.Key) => {
      const cellValue =
        columnKey === "number"
          ? user.number
          : user[columnKey as keyof StokBarang];

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
          <h1 className="mb-4 text-xl font-bold lg:text-[2vh]">Cari Data</h1>
          <div className="flex w-full flex-col justify-stretch gap-4 text-sm lg:flex-row">
            <select
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setGudang(e.target.value);
              }}
              name="gudang"
              id="123"
              className="border-black-500 w-full resize-none rounded border px-5 py-4"
            >
              <option value="">Pilih Gudang Tujuan</option>
              {gudangList.map((gudang) => (
                <option key={gudang.id} value={gudang.id}>
                  {gudang.nama_gudang}
                </option>
              ))}
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
        <h1 className="mb-4 text-xl font-bold lg:text-[2vh]">Cari Data</h1>
        <div className="flex w-full justify-stretch gap-4 text-sm">
          <select
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setGudang(e.target.value);
            }}
            name="gudang"
            id="123"
            className="border-black-500 w-full resize-none rounded border px-5 py-4"
          >
            <option value="">Pilih Gudang Tujuan</option>
            {gudangList.map((gudang) => (
              <option key={gudang.id} value={gudang.id}>
                {gudang.nama_gudang}
              </option>
            ))}
          </select>
          <Input type="text" placeholder="Masukan ID Purchase Order" />
          <Button className="bg-[#00186D] font-bold text-white">
            Cari/Cek
          </Button>
        </div>
      </div>

      <Divider />

      <div className="h-full">
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
                  allowsSorting={column.sortable}
                  className={`bg-blue-900 text-center text-white ${column.sortable ? "cursor-pointer" : ""} ${column.uid === "number" ? "w-1" : "w-32"}`} // Add fixed width
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
                    <TableCell className="max-w-32 items-center text-center">
                      {renderCell(item, columnKey)}
                    </TableCell>
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
