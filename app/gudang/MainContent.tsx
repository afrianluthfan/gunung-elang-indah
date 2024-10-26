import {
  button,
  Button,
  Divider,
  Input,
  Modal,
  useDisclosure,
} from "@nextui-org/react";
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
import { DeleteIcon } from "@/components/Tables/FinanceTable/DeleteIcon";
import ModalTambah from "@/components/modal/ModalTambah";

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
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "nama",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      fetchGudangList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const fetchGudangList = useCallback(async () => {
    try {
      const response = await axios.post(
        `http://209.182.237.155:8080/api/gudang/list`,
      );
      setGudangList(response.data.data);
    } catch (error) {
      setError("Error fetching Gudang list");
      console.error("Error fetching Gudang list:", error);
    }
  }, []);

  useEffect(() => {
    fetchGudangList();
  }, [fetchGudangList]);

  const headerColumns = useMemo(() => {
    const columns = [
      { name: "No", uid: "id" },
      { name: "Nama Gudang", uid: "nama_gudang" },
      { name: "Alamat Gudang", uid: "alamat_gudang" },
      { name: "Action", uid: "action" },
    ];
    return columns.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = Array.isArray(gudangList) ? [...gudangList] : [];

    if (filterValue) {
      filteredUsers = filteredUsers.filter((user) =>
        user.nama_gudang.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredUsers;
  }, [filterValue, gudangList]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: Gudang, b: Gudang) => {
      const first = a[sortDescriptor.column as keyof Gudang] as string | number;
      const second = b[sortDescriptor.column as keyof Gudang] as
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

  const handleDelete = useCallback(
    (id: number) => {
      try {
        Swal.fire({
          title: "Apakah Kamu Yakin?",
          text: "Apakah kamu yakin ingin data ini di input ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await axios.post(
                "http://209.182.237.155:8080/api/gudang/delete",
                {
                  id,
                },
              );
              fetchGudangList();
              Swal.fire("Nice!", "Data Berhasil Di Hapus!.", "success");
            } catch (error) {
              console.error("Error submitting data", error);
              Swal.fire(
                "Error!",
                "Terjadi kesalahan saat mengirim data.",
                "error",
              );
            }
          }
        });
      } catch (error) {
        console.error("Error processing request", error);
      }
    },
    [fetchGudangList],
  );

  const renderCell = useCallback(
    (
      gudang: Gudang & { number: number },
      columnKey: React.Key,
      index: number,
    ) => {
      if (columnKey === "action") {
        return (
          <Button
            className="bg-transparent"
            onClick={() => handleDelete(gudang.id)}
          >
            <DeleteIcon />
          </Button>
        );
      }

      return columnKey === "id" ? index + 1 : gudang[columnKey as keyof Gudang];
    },
    [handleDelete],
  );

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <div className="flex w-full flex-col justify-between gap-4">
        <h1 className="mb-4 text-xl font-bold lg:text-[2vh]">Cari Data</h1>
        <div className="flex w-full flex-col justify-stretch gap-2 text-sm lg:flex-row lg:items-center">
          <Input
            type="text"
            placeholder="Masukan ID Purchase Order"
            className="w-full"
          />
          <Button className="w-full rounded-md bg-[#00186D] font-bold text-white lg:w-auto">
            Cari/Cek
          </Button>
          <Button
            onPress={onOpen}
            className="w-full rounded-md bg-[#009338] font-bold text-white lg:w-auto"
          >
            Tambah Gudang
          </Button>
        </div>
      </div>

      <Divider />

      <div className="h-full">
        <div className="h-[100vh] w-full overflow-auto lg:h-[40vh]">
          <Table
            aria-label="Example table with dynamic content"
            className="h-full w-full"
            removeWrapper
            isHeaderSticky
            isStriped
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  allowsSorting={column.uid !== "id" && column.uid !== "action"}
                  className="bg-blue-900 text-white"
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={itemsWithIndex}
              emptyContent={<div>Data Tidak Ditemukan !</div>}
            >
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell className="bg-white">
                      {renderCell(
                        item,
                        columnKey,
                        itemsWithIndex.indexOf(item),
                      )}
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

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalTambah />
      </Modal>
    </div>
  );
};

export default MainContent;
