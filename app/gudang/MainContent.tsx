import { button, Button, Divider, Input, Modal, Tooltip, useDisclosure } from "@nextui-org/react";
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
import { DeleteIcon } from "../../components/Tables/FinanceTable/DeleteIcon";
import router from "next/router";
import ModalTambah from "../../components/modal/ModalTambah";

type Gudang = {
  id: number;
  nama_gudang: string;
  alamat_gudang: string;
};

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "nama_gudang",
  "alamat_gudang",
  "action",
];

const MainContent = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [filterValue, setFilterValue] = useState("");
  const [gudangList, setGudangList] = useState<Gudang[]>([]);
  const [visibleColumns] = useState<Set<string>>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "nama_gudang",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!isOpen) {
      fetchGudangList();
    }
  }, [isOpen]);

  const fetchGudangList = useCallback(async () => {
    try {
      const response = await axios.post(`${apiUrl}/gudang/list`);
      setGudangList(response.data.data);
    } catch (error) {
      setError("Error fetching Gudang list");
      console.error("Error fetching Gudang list:", error);
    }
  }, []);

  useEffect(() => {
    fetchGudangList();
  }, [fetchGudangList]);

  const columns = [
    { name: "No", uid: "id" },
    { name: "Nama Gudang", uid: "nama_gudang" },
    { name: "Alamat Gudang", uid: "alamat_gudang" },
    { name: "Action", uid: "action" },
  ];

  const headerColumns = useMemo(() => {
    return columns.filter((column) => visibleColumns.has(column.uid));
  }, [columns, visibleColumns]);

  const filteredItems = useMemo(() => {
    return gudangList.filter((gudang) =>
      gudang.nama_gudang.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [filterValue, gudangList]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Gudang] as string | number;
      const second = b[sortDescriptor.column as keyof Gudang] as string | number;
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

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Apakah Kamu Yakin?",
      text: "Apakah kamu yakin ingin data ini dihapus?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(`${apiUrl}/gudang/delete`, { id });
          fetchGudangList();
          Swal.fire("Nice!", "Data Berhasil Dihapus!.", "success");
        } catch (error) {
          console.error("Error deleting data", error);
          Swal.fire("Error!", "Terjadi kesalahan saat menghapus data.", "error");
        }
      }
    });
  };

  const renderCell = useCallback(
    (gudang: Gudang & { number: number }, columnKey: React.Key, index: number) => {
      if (columnKey === "action") {
        return (
          <Button className="bg-transparent" onClick={() => handleDelete(gudang.id)}>
            <DeleteIcon />
          </Button>
        );
      }
      return columnKey === "id" ? index + 1 : gudang[columnKey as keyof Gudang];
    },
    [handleDelete]
  );

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <div className="flex w-full flex-col justify-between gap-4">
        <h1 className="text-xl font-bold mb-4 lg:text-[2vh]">Cari Gudang</h1>
        <div className="text-sm flex flex-col w-full justify-stretch gap-2 lg:flex-row lg:items-center">
          <Input
            type="text"
            placeholder="Masukkan Nama Gudang"
            className=" w-full border-1 border-blue-900 rounded-xl"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
          <Button className="bg-[#0C295F] font-bold text-white rounded-md w-full lg:w-auto">
            Cari/Cek
          </Button>
          <Button onPress={onOpen} className="bg-[#009338] font-bold text-white rounded-md w-full lg:w-auto">
            Tambah Gudang
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
              emptyContent={<div>Data Tidak Ditemukan!</div>}
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
            showShadow
            color="primary"
            page={page}
            onChange={setPage}
            total={pages}
          />
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalTambah />
      </Modal>
    </div>
  );
};

export default MainContent;
