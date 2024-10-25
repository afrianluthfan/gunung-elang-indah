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
import { useRouter } from "next/navigation";

type User = {
  id: number;
  nama_perusahaan: string;
  notelp_perusahaan: string;
  nama_dokter: string;
  notelp_dokter: string;
};

type RumahSakit = {
  id: number;
  name: string;
  address_company: string;
};

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "nama_perusahaan",
  "notelp_perusahaan",
  "nama_dokter",
  "notelp_dokter",
  "action",
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
        `http://209.182.237.155:8080/api/proforma-invoice/rs-list`
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
          `http://209.182.237.155:8080/api/profile/ListByCustomer`,
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
    { name: "Nama Perusahaan", uid: "nama_perusahaan" },
    { name: "Nomor Telpon Perusahaan", uid: "notelp_perusahaan" },
    { name: "Nama ", uid: "nama_dokter" },
    { name: "Nomor ", uid: "notelp_dokter" },
    { name: "Aksi", uid: "action" },
  ];

  const headerColumns = useMemo(() => {
    return columns.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = Array.isArray(users) ? [...users] : [];

    if (filterValue) {
      filteredUsers = filteredUsers.filter((user) =>
        user.nama_perusahaan.toLowerCase().includes(filterValue.toLowerCase())
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

  const router = useRouter();

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

      if (columnKey === "action") {
        return (
          <div className="flex gap-2">
            <Button
              className="bg-blue-600 text-white"
              size="sm"
              onClick={() => router.push(`/profiling-dua/form-edit?id=${user.id}`)}
            >
              Edit
            </Button>
          </div>
        );
      }

      return columnKey === "id" ? index + 1 : user[columnKey as keyof User];
    },
    [users, router] // tambahkan router di dalam dependency array
  );

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
            placeholder="Cari Nama Dokter !"
            className="w-full"
            onChange={(e) => setFilterValue(e.target.value)}
            value={filterValue}
          />
          <Button className="bg-[#0C295F] font-bold text-white rounded-md w-full lg:w-auto">
            Cari/Cek
          </Button>
          <Button
            className="bg-green-700 font-bold text-white rounded-md w-full lg:w-auto"
            onClick={() => router.push("/profiling-dua/form")}
          >
            Tambah
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
        <div className="w-full mt-5 lg:w-auto">
          <Pagination
            color="primary"
            page={page}
            total={pages}
            onChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
