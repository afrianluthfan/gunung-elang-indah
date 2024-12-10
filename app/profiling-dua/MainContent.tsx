import { Button, Divider, Input, Tooltip } from "@nextui-org/react";
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
import { EyeIcon } from "../../components/icon/EyeIcon";
import { EditIcon } from "../../components/icon/EditIcon";

type User = {
  id: number;
  nama_perusahaan: string;
  notelp_perusahaan: string;
  nama_dokter: string;
  notelp_dokter: string;
};

type RumahSakit = {
  kategori_divisi: string;
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
  const [selectedDivisi, setSelectedDivisi] = useState<string>("");
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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchGudangList = useCallback(async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/proforma-invoice/rs-list`
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
          `${apiUrl}/profile/ListByCustomer`,
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

  const columns = useMemo(() => {
    const selectedRS = gudangList.find(rs => rs.name === gudang);
    const baseColumns = [
      { name: "No", uid: "id" },
      { name: "Nama Perusahaan", uid: "nama_perusahaan" },
      { name: "Nomor Telpon Perusahaan", uid: "notelp_perusahaan" },
      { name: "Nomor ", uid: "notelp_dokter" },
      { name: "Aksi", uid: "action" },
    ];

    if (selectedRS?.kategori_divisi === "Customer") {
      baseColumns.splice(3, 0, { name: "Nama ", uid: "nama_dokter" });
    }

    return baseColumns;
  }, [gudang, gudangList]);

  const headerColumns = useMemo(() => {
    return columns.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns, columns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = Array.isArray(users) ? [...users] : [];

    if (filterValue) {
      filteredUsers = filteredUsers.filter((user) =>
        user.nama_dokter.toLowerCase().includes(filterValue.toLowerCase())
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

            <Tooltip content="Details" className="text-black">
              <span
                onClick={() => router.push(`/profiling-dua/detail?id=${user.id}`)}
                className="cursor-pointer text-lg text-default-400 active:opacity-50"
              >
                <EyeIcon />
              </span>
            </Tooltip>

            <Tooltip content="Edit" className="text-black">
              <span
                onClick={() => router.push(`/profiling-dua/form-edit?id=${user.id}`)}
                className="cursor-pointer text-lg text-default-400 active:opacity-50"
              >
                <EditIcon />
              </span>
            </Tooltip>
          </div>
        );
      }

      return columnKey === "id" ? index + 1 : user[columnKey as keyof User];
    },
    [users, router]
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
            onChange={(e) => {
              setGudang(e.target.value);
              const selectedRS = gudangList.find(rs => rs.name === e.target.value);
              setSelectedDivisi(selectedRS?.kategori_divisi || "");
            }}
          >
            <option value="">Pilih Perusahaan</option>
            {gudangList.map((gudang) => (
              <option key={gudang.name} value={gudang.name}>
                {gudang.name} - {gudang.kategori_divisi}
              </option>
            ))}
          </select>
          <Input
            type="text"
            placeholder="Cari Nama Dokter !"
            className=" w-full border-1 border-blue-900 rounded-xl"
            onChange={(e) => setFilterValue(e.target.value)}
            value={filterValue}
            isDisabled={gudang === ""}
          />
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
          {
            pages && (
              <Pagination
                showControls
                showShadow
                autoFocus={true}
                initialPage={1}
                color="primary"
                page={page}
                onChange={setPage}
                total={pages}
              />
            )
          }
        </div>
      </div>

      <div>
        <hr className="border-t-2 border-gray-300 my-4" />
        <h1 className="text-sm mb-4 text-center">© License held by PT Gunung Elang Indah</h1>
      </div>
    </div>
  );
};

export default MainContent;