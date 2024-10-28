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
import Swal from "sweetalert2";

type User = {
  id: number;
  kode: string;
  namaGudang: string;
  nama: string;
  price: string;
  variable: string;
  diskon: number;
  added: string;
};

type RumahSakit = {
  id: number;
  name: string;
  address_company: string;
};

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "variable",
  "nama",
  "diskon",
  "price",
  "kode",
  "namaGudang",
  "added",
];

const MainContent = () => {
  const [users, setUsers] = useState<User[]>([]);

  const [search, setSerch] = useState<string>("");

  const [filterValue, setFilterValue] = useState("");
  const [gudang, setGudang] = useState("");
  const [gudangList, setGudangList] = useState<RumahSakit[]>([]);
  const [visibleColumns] = useState<Set<string>>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "nama",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const fetchGudangList = useCallback(async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/proforma-invoice/rs-listc`
      );
      setGudangList(response.data.data);
    } catch (error) {
      setError("Error fetching Gudang list");
      console.error("Error fetching Gudang list:", error);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      let response;
      if (gudang && gudang !== "0") {
        response = await axios.post(
          `${apiUrl}/price/ListByCustomer`,
          { nama: gudang }
        );
        setUsers([]); // Bersihkan data sebelum set data baru
        setUsers(response.data.data);
      }
    } catch (error) {
      setError("Error fetching data");
      console.error("Error fetching data:", error);
    }
  }, [gudang]);

  useEffect(() => {
    fetchGudangList();
  }, [fetchGudangList]);

  useEffect(() => {
    setUsers([]);
    if (gudang && gudang !== "0") {
      fetchData();
    }
  }, [gudang, fetchData]);

  const columns = [
    { name: "No", uid: "id" },
    { name: "Variable", uid: "variable" },
    { name: "Nama", uid: "nama" },
    { name: "Katalog", uid: "kode" },
    { name: "Diskon", uid: "diskon" },
    { name: "Harga Satuan", uid: "price" },
  ];

  const headerColumns = useMemo(() => {
    return columns.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = Array.isArray(users) ? [...users] : [];

    if (filterValue) {
      filteredUsers = filteredUsers.filter((user) =>
        user.nama.toLowerCase().includes(filterValue.toLowerCase())
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

  const handleInputChange2 = (index: number, key: keyof User, value: string, id: number) => {
    const findUser = users.findIndex((user) => user.id === id);

    const updatedUsers = [...users];
    updatedUsers[findUser] = { ...updatedUsers[findUser], [key]: value };
    setUsers(updatedUsers);
  };
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const renderCell = useCallback(
    (user: User & { number: number }, columnKey: React.Key, index: number) => {
      if (columnKey === "price" || columnKey === "diskon") {
        return (
          <Input
            value={user[columnKey as keyof User]?.toString()}
            onChange={(e) =>
              handleInputChange2(index, columnKey as keyof User, e.target.value, user.id)
            }
          />
        );
      }

      return columnKey === "id"
        ? index + 1
        : user[columnKey as keyof User];
    },
    [users]
  );

  const handleSetHarga = async () => {
    try {
      const input = users.map((user) => ({
        nama_Rumah_Sakit: gudang,
        kode: user.kode,
        variable: user.variable,
        nama: user.nama,
        diskon: Number(user.diskon),
        price: user.price,
        added: user.added,
      }));

      const response = await axios.post(
        `${apiUrl}/price/SetPrice`,
        { input }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Sukses!",
          text: "Data berhasil dikirim!",
          icon: "success",
          confirmButtonText: "OK",
        });

        fetchData();
      } else {
        Swal.fire({
          title: "Gagal!",
          text: "Gagal mengirim data.",
          icon: "error",
          confirmButtonText: "Coba Lagi",
        });
      }
    } catch (error) {
      console.error("Error sending data:", error);
      Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan saat mengirim data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (error) {
    return <div>{error}</div>;
  }



  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <div className="flex w-full flex-col justify-between gap-4">
        <h1 className="text-xl font-bold mb-4 lg:text-[2vh]">Cari Data</h1>
        <div className="text-sm flex flex-col w-full justify-stretch gap-2 lg:flex-row lg:items-center">
          <select
            name="Pilih Gudang"
            id="123"
            className="rounded-lg border text-black text-small border-blue-900 bg-white p-2 w-full lg:w-auto"
            value={gudang}
            onChange={(e) => setGudang(e.target.value)}
          >
            <option value="0">Pilih Rumah Sakit</option>
            {gudangList.map((gudang) => (
              <option key={gudang.name} value={gudang.name}>
                {gudang.name} - {gudang.address_company}
              </option>
            ))}
          </select>
          <Input
            type="text"
            placeholder="Cari Nama Barang !"
            className="w-full border-1 border-blue-800 rounded-xl "
            onChange={(e) => setFilterValue(e.target.value)}
            value={filterValue}
          />
          <Button className="bg-[#0C295F] font-bold text-white rounded-md w-full lg:w-auto">
            Cari/Cek
          </Button>
          <Button
            className="bg-green-700 font-bold text-white rounded-md w-full lg:w-auto"
            onClick={handleSetHarga}
          >
            Set Harga
          </Button>
        </div>
      </div>


      <Divider />

      <div className="h-full">
        <div className="h-[100vh] lg:h-[40vh] w-full overflow-auto">
          <Table
            aria-label="Example table with dynamic content"
            className="w-full h-full"
            removeWrapper
            isHeaderSticky
            isStriped
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn key={column.uid} allowsSorting className="bg-[#0C295F] text-white">
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={itemsWithIndex}
              emptyContent={<div>Data Tidak Ditemukan / Anda Blm Melimih Customer</div>}
            >
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell className="bg-white">
                      {renderCell(item, columnKey, itemsWithIndex.indexOf(item))}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end p-4">
          <Pagination
            showControls
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default MainContent;