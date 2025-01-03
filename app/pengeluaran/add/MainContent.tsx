import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Button,
  Divider,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import Swal from "sweetalert2";
import { DeleteIcon } from "../../../components/Tables/AdminTable/DeleteIcon";

type ItemDetail = {
  gudang: string
  variable: string
  kode: string
  id: number;
  name: string;
  quantity: string;
  price: string;
  discount: string;
  lots: string;
};

type PurchaseOrder = {
  nama_suplier: string;
  catatan_po: string;
  prepared_by: string;
  prepared_jabatan: string;
  approved_by: string;
  approved_jabatan: string;
  item: ItemDetail[];
  item_deleted: { id: number }[];
};

type Gudang = {
  id: number;
  nama_gudang: string;
  alamat_gudang: string;
};

const AdminMainContent = () => {
  const router = useRouter();
  const [responseData, setResponseData] = useState<PurchaseOrder>({
    nama_suplier: "",
    catatan_po: "",
    prepared_by: "",
    prepared_jabatan: "",
    approved_by: "",
    approved_jabatan: "",
    item: [],
    item_deleted: [],
  });

  const [isRejected, setIsRejected] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [stockData, setStockData] = useState<any[]>([]);
  const [itemSuggestions, setItemSuggestions] = useState<{ [key: number]: string[] }>({});
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (shouldSubmit) {
      const submitData = async () => {
        try {
          // Check if any required field is empty
          const res = await axios.post(
            `${apiUrl}/pengeluaran/inquiry`,
            responseData
          );

          localStorage.setItem("purchaseOrder", JSON.stringify(res));
          // console.log("Response Data:", res.data);
          router.push("/pengeluaran/add/preview");
          setIsRejected(false);
        } catch (error) {
          console.error("Error submitting data", error);
        } finally {
          setShouldSubmit(false);
        }
      };

      submitData();
    }
  }, [shouldSubmit, responseData]);
  const handleDelete = (id: number) => {
    if (id !== undefined) {
      Swal.fire({
        title: "Apakah Kamu Yakin?",
        text: "Apakah kamu yakin ingin menerima purchase order ini!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, accept it!",
      }).then((result) => {
        if (result.isConfirmed) {
          setResponseData((prevData) => ({
            ...prevData,
            item: prevData.item.filter((item) => item.id !== id),
            item_deleted: Array.isArray(prevData.item_deleted)
              ? [...prevData.item_deleted, { id }]
              : [{ id }],
          }));
        }
      });
    }
  };


  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>, itemId?: number) => {
    const { name, value } = e.target;

    if (name === "name") {
      if (value.length > 1) {
        const filteredSuggestions = stockData
          .filter((item: { name?: string }) => item.name && item.name.toLowerCase().includes(value.toLowerCase()))
          .map((item: { name: string }) => item.name);
        setItemSuggestions((prevSuggestions) => ({
          ...prevSuggestions,
          [itemId!]: filteredSuggestions,
        }));
      } else {
        setItemSuggestions((prevSuggestions) => ({
          ...prevSuggestions,
          [itemId!]: [],
        }));
      }
    }

    if (itemId !== undefined) {
      setResponseData((prevData) => ({
        ...prevData,
        item: prevData.item.map((item) =>
          item.id === itemId ? { ...item, [name]: value } : item
        ),
      }));
    } else {
      setResponseData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleAddItem = () => {
    setResponseData((prevData) => ({
      ...prevData,
      item: [
        ...prevData.item,
        {
          id: Date.now(),
          po_id: Date.now(),
          name: "",
          quantity: "",
          price: "",
          discount: "",
          amount: "",
          variable: "",
          kode: "",
          gudang: "",
          lots: "",
        },
      ],
    }));
  };

  const submitAcc = () => {
    setResponseData((prevData) => ({
      ...prevData,
      status: "DITERIMA",
    }));
    setShouldSubmit(true);
  };

  const cancelReject = () => {
    setIsRejected(false);
  };

  const handleSuggestionClick = (suggestion: string, itemId: number) => {
    const selectedItem = stockData.find((item) => item.name === suggestion);
    if (selectedItem) {
      setResponseData((prevData) => ({
        ...prevData,
        item: prevData.item.map((item) =>
          item.id === itemId
            ? {
              ...item,
              name: selectedItem.name,
              kode: selectedItem.kode,
              variable: selectedItem.variable,
              price: selectedItem.price.toString(),
            }
            : item

        ),
      }));
      setItemSuggestions((prevSuggestions) => ({
        ...prevSuggestions,
        [itemId]: [],
      }));
    }
  };

  const [gudangList, setGudangList] = useState<Gudang[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGudangList = async () => {
      try {
        const response = await axios.post(
          `${apiUrl}/gudang/list`
        );
        setGudangList(response.data.data);
      } catch (error) {
        setError("Error fetching Gudang list");
        console.error("Error fetching Gudang list:", error);
      }
    }

    fetchGudangList();
  }, []);



  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <h1 className="font-bold">Tambah Pengeluaran</h1>
      <Divider />

      <div className="flex gap-4">
        <div className="flex flex-col space-y-2 w-full md:w-1/3">
          <label className="text-left">Perusahaan / Toko:</label>
          <Input
            value={responseData.nama_suplier}
            name="nama_suplier"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Perusahaan / Toko"
            className="p-2 border border-gray-300 rounded"
          />

          <label className="text-left">Keterangan: </label>
          <Input
            value={responseData.catatan_po}
            name="catatan_po"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Keterangan"
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex flex-col space-y-2 w-full md:w-1/3">
          <label className="text-left">Prepared by:</label>
          <Input
            value={responseData.prepared_by}
            name="prepared_by"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Prepared by"
            className="p-2 border border-gray-300 rounded"
          />
          <label className="text-left">Jabatan Prepared:</label>
          <Input
            value={responseData.prepared_jabatan}
            name="prepared_jabatan"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Jabatan Prepared"
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex flex-col space-y-2 w-full md:w-1/3">
          <label className="text-left">Approved by:</label>
          <Input
            value={responseData.approved_by}
            name="approved_by"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Approved by"
            className="p-2 border border-gray-300 rounded"
          />
          <label className="text-left">Jabatan Approvel:</label>
          <Input
            value={responseData.approved_jabatan}
            name="approved_jabatan"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Jabatan Approved"
            className="p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
      <hr className="border-t-2 border-gray-200" />
      <div className="flex justify-between ">
        <h1 className="text-medium text-black font-semibold mt-2">Data Barang</h1>
        <Button onClick={handleAddItem} className="bg-[#0C295F] text-white">Tambah Barang</Button>
      </div>
      <Table removeWrapper>
        <TableHeader>
          <TableColumn className="bg-[#0C295F] text-white text-center">No</TableColumn>
          <TableColumn className="bg-[#0C295F] text-white text-center w-[300px]">Nama Barang</TableColumn>
          <TableColumn className="bg-[#0C295F] text-white text-center">Variable</TableColumn>
          <TableColumn className="bg-[#0C295F] text-white text-center">Kode</TableColumn>
          <TableColumn className="bg-[#0C295F] text-white text-center">Lots</TableColumn>
          <TableColumn className="bg-[#0C295F] text-white text-center">Quantity</TableColumn>
          <TableColumn className="bg-[#0C295F] text-white text-center">Harga Satuan</TableColumn>
          <TableColumn className="bg-[#0C295F] text-white text-center">Diskon</TableColumn>
          <TableColumn className="bg-[#0C295F] text-white text-center">Aksi</TableColumn>
        </TableHeader>
        <TableBody>
          {responseData.item.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <div className="relative">
                  <textarea
                    value={item.name}
                    name="name"
                    className="w-full p-2 border border-black-500 rounded resize-none"
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(e as unknown as React.ChangeEvent<HTMLInputElement>, item.id)}
                    placeholder="Nama Barang"
                  />
                  {itemSuggestions[item.id]?.length > 0 && (
                    <div className="absolute bg-white border mt-2 w-full shadow-lg z-10 !h-[300px] overflow-y-auto">
                      {itemSuggestions[item.id].map((suggestion, idx) => (
                        <div
                          key={idx}
                          className="cursor-pointer p-2 hover:bg-gray-100"
                          onClick={() => handleSuggestionClick(suggestion, item.id)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <textarea
                  value={item.variable}
                  className="w-full p-2 border border-black-500 rounded "
                  name="variable"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(e as unknown as React.ChangeEvent<HTMLInputElement>, item.id)}
                  placeholder="Variable"
                />
              </TableCell>
              <TableCell>
                <textarea
                  value={item.kode}
                  className="w-full p-2 border border-black-500 rounded "
                  name="kode"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(e as unknown as React.ChangeEvent<HTMLInputElement>, item.id)}
                  placeholder="Kode"
                />
              </TableCell>
              <TableCell>
                <textarea
                  value={item.lots}
                  className="w-full p-2 border border-black-500 rounded "
                  name="lots"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(e as unknown as React.ChangeEvent<HTMLInputElement>, item.id)}
                  placeholder="Lots"
                />
              </TableCell>
              <TableCell>
                <textarea
                  value={item.quantity}
                  name="quantity"
                  className="w-full p-2 border border-black-500 rounded resize-none"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(e as unknown as React.ChangeEvent<HTMLInputElement>, item.id)}
                  placeholder="Quantity"
                />
              </TableCell>
              <TableCell>
                <textarea
                  value={item.price}
                  name="price"
                  className="w-full p-2 border border-black-500 rounded resize-none"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(e as unknown as React.ChangeEvent<HTMLInputElement>, item.id)}
                  placeholder="Harga Satuan"
                />
              </TableCell>
              <TableCell>
                <textarea
                  value={item.discount || "0"}
                  name="discount"
                  className="w-full p-2 border border-black-500 rounded resize-none"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(e as unknown as React.ChangeEvent<HTMLInputElement>, item.id)}
                  placeholder="Diskon"
                />
              </TableCell>

              <TableCell>
                <Tooltip content="Delete" className="text-black">
                  <span
                    className="cursor-pointer text-lg text-default-400 active:opacity-50"
                    onClick={() => handleDelete(item.id)}
                  >
                    <DeleteIcon />
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!isRejected && (
        <div className="flex justify-end gap-3">
          <Button
            onClick={cancelReject}
            color="danger"
            className="min-w-36 text-white"
          >
            Kembali
          </Button>
          <Button
            onClick={submitAcc}
            color="success"
            className="min-w-36 text-white"
          >
            Lanjutkan
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminMainContent;


