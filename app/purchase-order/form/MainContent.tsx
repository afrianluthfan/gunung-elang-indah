import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
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
import TopSectionLeftSide from "../TopSectionLeftSide";
import Swal from "sweetalert2";
import { DeleteIcon } from "../../../components/Tables/AdminTable/DeleteIcon";

type ItemDetail = {
  id: number;
  po_id: number;
  name: string;
  quantity: string;
  price: string;
  discount: string;
  amount: string;
};

type PurchaseOrder = {
  id: number;
  nama_suplier: string;
  nomor_po: string;
  tanggal: string;
  catatan_po: string;
  prepared_by: string;
  prepared_jabatan: string;
  approved_by: string;
  approved_jabatan: string;
  sub_total: string;
  pajak: string;
  total: string;
  status: string;
  reason?: string;
  item: ItemDetail[];
  item_deleted: { id: number }[];
};

const AdminMainContent = () => {
  const router = useRouter();
  const [responseData, setResponseData] = useState<PurchaseOrder>({
    id: 0,
    nama_suplier: "",
    nomor_po: "",
    tanggal: "",
    catatan_po: "",
    prepared_by: "",
    prepared_jabatan: "",
    approved_by: "",
    approved_jabatan: "",
    sub_total: "",
    pajak: "",
    total: "",
    status: "",
    reason: "",
    item: [],
    item_deleted: [],
  });

  const [isRejected, setIsRejected] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [stockData, setStockData] = useState<any[]>([]);
  const [itemSuggestions, setItemSuggestions] = useState<{ [key: number]: string[] }>({});

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const res = await axios.post("http://localhost:8080/api/stock-barang/list");
        setStockData(res.data.data);
      } catch (error) {
        console.error("Error fetching stock data", error);
      }
    };

    fetchStockData();
  }, []);

  useEffect(() => {
    if (shouldSubmit) {
      const submitData = async () => {
        try {
          const res = await axios.post(
            "http://localhost:8080/api/purchase-order/inquiry",
            responseData
          );

          localStorage.setItem("purchaseOrder", JSON.stringify(res));
          router.push("/purchase-order/form/preview");
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
          .filter((item: { name: string }) => item.name.toLowerCase().includes(value.toLowerCase()))
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
          id: Date.now(), // Generate a unique ID for new items
          po_id: Date.now(),
          name: "",
          quantity: "",
          price: "",
          discount: "",
          amount: "",
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
              price: selectedItem.price.toString(), // Convert to string if needed
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

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        <TopSectionLeftSide />
      </ContentTopSectionLayout>
      <Divider />

      <div className="flex gap-4">
        <div className="flex flex-col space-y-2 w-full md:w-1/3">
          <label className="text-left">Supplier:</label>
          <Input
            value={responseData.nama_suplier}
            name="nama_suplier"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Nama Suplier"
            className="p-2 border border-gray-300 rounded"
          />
          <label className="text-left">Catatan PO:</label>
          <Input
            value={responseData.catatan_po}
            name="catatan_po"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Catatan PO"
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
      <div className="flex justify-between gap-3">
        <h1 className="text-xl text-black font-semibold mt-2">Data Barang</h1>
        <Button onClick={handleAddItem} className="bg-blue-900 text-white">Tambah Barang</Button>
      </div>
      <Table removeWrapper>
        <TableHeader>
          <TableColumn className="bg-blue-900 text-white text-center">No</TableColumn>
          <TableColumn className="bg-blue-900 text-white text-center">Nama Barang</TableColumn>
          <TableColumn className="bg-blue-900 text-white text-center">Quantity</TableColumn>
          <TableColumn className="bg-blue-900 text-white text-center">Harga Satuan</TableColumn>
          <TableColumn className="bg-blue-900 text-white text-center">Discount</TableColumn>
          <TableColumn className="bg-blue-900 text-white text-center">Aksi</TableColumn>
        </TableHeader>
        <TableBody>
          {responseData.item.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell >
                <div className="relative">
                  <Input
                    value={item.name}
                    name="name"
                    onChange={(e) => handleFieldChange(e, item.id)}
                    placeholder="Nama Barang"
                  />
                  {itemSuggestions[item.id]?.length > 0 && (
                    <div className="absolute bg-white border mt-2 w-full shadow-lg z-10">
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
                <Input
                  value={item.quantity}
                  name="quantity"
                  onChange={(e) => handleFieldChange(e, item.id)}
                  placeholder="Quantity"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={item.price}
                  name="price"
                  onChange={(e) => handleFieldChange(e, item.id)}
                  placeholder="Harga Satuan"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={item.discount.replace(/%/g, '')} // Remove '%' from display
                  name="discount"
                  onChange={(e) => handleFieldChange(e, item.id)}
                  placeholder="Discount"
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
