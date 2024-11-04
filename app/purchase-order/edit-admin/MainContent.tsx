import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import TopSectionLeftSide from "../TopSectionLeftSide";
import Swal from "sweetalert2";
import { DeleteIcon } from "../../../components/Tables/AdminTable/DeleteIcon";

type Gudang = {
  id: number;
  nama_gudang: string;
  alamat_gudang: string;
};

type ItemDetail = {
  id: number;
  po_id: number;
  name: string;
  quantity: string;
  price: string;
  discount: string;
  amount: string;
  kode: string;
  variable: string;
  gudang: string;
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

function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: any[]) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

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
  const [stockItems, setStockItems] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Record<number, string[]>>({});
  const [prices, setPrices] = useState<Record<string, string>>({});

  const [GUDANG, setGudang] = useState("");

  const [stockData, setStockData] = useState<any[]>([]);

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');


  // SUYGGESTION SEARCH

  const [itemSuggestions, setItemSuggestions] = useState<{ [key: number]: string[] }>({});

  const searchParams = useSearchParams();
  const id = searchParams.get("id");



  useEffect(() => {
    if (!id) {
      console.error("ID is missing");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${apiUrl}/purchase-order/detail`,
          { id: id }
        );
        setResponseData(response.data.data);
        if (response.data.data) {
          setSelectedSupplier(response.data.data.nama_suplier);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const response = await axios.post(`${apiUrl}/proforma-invoice/rs-lists`);
        if (response.data && response.data.data) {
          setSuppliers(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchSuppliers();
    fetchData();
  }, [id]);

  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    const [namaCustomer, alamat] = newValue.split('|');
    setSelectedSupplier(newValue);

    setResponseData(prevData => ({
      ...prevData,
      nama_suplier: namaCustomer,
    }));
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchStockItems = async () => {
      try {
        const response = await axios.post(`${apiUrl}/stock-barang/list`);
        const items = response.data.data;
        setStockItems(items.map((item: { name: string }) => item.name));
        const pricesMap = items.reduce((acc: Record<string, { price: string; kode: string; variable: string }>, item: { name: string, price: string, variable: string, kode: string }) => {
          acc[item.name] = { price: item.price, kode: item.kode, variable: item.variable };
          return acc;
        }, {});
        setPrices(pricesMap);
      } catch (error) {
        console.error("Error fetching stock items", error);
      }
    };

    fetchStockItems();
  }, []);

  const showSuggestions = async (query: string, index: number) => {
    if (!query) {
      setSuggestions((prev) => ({ ...prev, [index]: [] }));
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/stock-barang/list?query=${query}`
      );
      const filteredSuggestions = response.data.data
        .filter((item: { name: string }) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        )
        .map((item: { name: string }) => item.name);

      setSuggestions((prev) => ({ ...prev, [index]: filteredSuggestions }));
    } catch (error) {
      console.error("Error fetching suggestions", error);
    }
  };

  const updatePriceForItem = (itemIndex: number, itemName: string) => {
    const priceInfo = prices[itemName] || { price: "", kode: "", variable: "" };
    setResponseData((prevData) => ({
      ...prevData,
      item: prevData.item.map((item, index) =>
        index === itemIndex ? { ...item, price: typeof priceInfo === 'object' ? priceInfo.price : '', kode: typeof priceInfo === 'object' ? priceInfo.kode : '', variable: typeof priceInfo === 'object' ? priceInfo.variable : '' } : item
      ),
    }));
  };

  useEffect(() => {
    if (shouldSubmit) {
      const submitData = async () => {
        try {
          const res = await axios.post(
            `${apiUrl}/purchase-order/edit/inquiry`,
            responseData
          );

          localStorage.setItem("purchaseOrder", JSON.stringify(res));
          localStorage.setItem("aksi", "update");
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

  const handleDelete = (index: number) => {
    Swal.fire({
      title: "Apakah Kamu Yakin ?",
      text: "Apakah kamu yakin ingin menghapus barang ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setResponseData((prevData) => {
          const itemToDelete = prevData.item[index];
          const updatedItemDeleted = Array.isArray(prevData.item_deleted)
            ? [...prevData.item_deleted, { id: itemToDelete.id }]
            : [{ id: itemToDelete.id }];

          return {
            ...prevData,
            item: prevData.item.filter((_, i) => i !== index),
            item_deleted: updatedItemDeleted,
          };
        });
      }
    });
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    itemIndex?: number
  ) => {
    const { name, value } = e.target;

    if (itemIndex !== undefined) {
      setResponseData((prevData) => {
        const updatedItems = prevData.item.map((item, index) =>
          index === itemIndex ? { ...item, [name]: value } : item
        );
        if (name === "name") {
          updatePriceForItem(itemIndex, value);
        }
        return { ...prevData, item: updatedItems };
      });
      showSuggestions(value, itemIndex); // Update suggestions for specific item
    } else {
      setResponseData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    setResponseData((prevData) => ({
      ...prevData,
      item: prevData.item.map((item) =>
        item.id === itemIndex ? { ...item, gudang: value } : item
      )
    }));
  };
  const handleAddItem = () => {
    setResponseData((prevData) => ({
      ...prevData,
      item: [
        ...prevData.item,
        {
          id: 0,
          po_id: 0,
          name: "",
          quantity: "",
          price: "",
          discount: "",
          amount: "",
          kode: "",
          variable: "",
          gudang: "",
        },
      ],
    }));
  };

  const submitAcc = () => {
    setResponseData((prevData) => ({
      ...prevData,
      status: "DIPROSES",
    }));
    setShouldSubmit(true);
  };

  const tolak = () => {
    router.push("/purchase-order");
  };

  const cancelReject = () => {
    setIsRejected(false);
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
      {responseData.reason && (
        <div>
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p className="font-bold">Alasan Penolakan:</p>
            <p>{responseData.reason}</p>
          </div>
        </div>
      )}

      <h1 className="font-semibold text-xl">Edit Purchase Order</h1>
      <Divider />
      <div className="flex gap-4">
        <div className="flex w-full flex-col space-y-2 md:w-1/3">
          <label className="text-left">Supplier:</label>
          <select id="supplier" className="h-full border border-gray-300 rounded-md border-1" value={selectedSupplier} onChange={handleSupplierChange}>
            <option value="">-- Pilih Supplier --</option>
            {suppliers.map((supplier: {
              address_company: string; id: string | number, name: string
            }) => (
              <option key={supplier.id} value={`${supplier.name}`}>
                {supplier.name}
              </option>
            ))}
          </select>
          <label className="text-left">Catatan PO:</label>
          <Input
            value={responseData.catatan_po}
            name="catatan_po"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Catatan PO"
            className="py-2 rounded"
          />
        </div>
        <div className="flex w-full flex-col space-y-2 md:w-1/3">
          <label className="text-left">Prepared by:</label>
          <Input
            value={responseData.prepared_by}
            name="prepared_by"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Prepared by"
            className="rounded py-2"
          />
          <label className="text-left">Jabatan Prepared:</label>
          <Input
            value={responseData.prepared_jabatan}
            name="prepared_jabatan"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Jabatan Prepared"
            className="rounded py-2"
          />
        </div>
        <div className="flex w-full flex-col space-y-2 md:w-1/3">
          <label className="text-left">Approved by:</label>
          <Input
            value={responseData.approved_by}
            name="approved_by"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Approved by"
            className="rounded py-2"
          />
          <label className="text-left">Jabatan Approved:</label>
          <Input
            value={responseData.approved_jabatan}
            name="approved_jabatan"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Jabatan Approved"
            className="rounded py-2"
          />
        </div>
      </div>

      <Divider />

      <div className="flex justify-between items-center">
        <h3 className="mb-2 text-left text-lg font-semibold">Barang:</h3>
        <div className="mb-2 flex justify-center">
          <Button className="bg-[#0C295F] text-white" onClick={handleAddItem}>
            Tambah Barang
          </Button>
        </div>
      </div>

      <Table removeWrapper className="mb-4">
        <TableHeader>
          <TableColumn className="bg-[#0C295F] text-white text-center">No</TableColumn>
          <TableColumn className="bg-[#0C295F] text-white">Nama Barang</TableColumn>
          <TableColumn className="bg-[#0C295F] text-white">Kode</TableColumn>
          <TableColumn className="bg-[#0C295F] text-white">Variable</TableColumn>
          <TableColumn className="bg-[#0C295F] text-white">Quantity</TableColumn>
          <TableColumn className="bg-[#0C295F] text-white">Harga Satuan</TableColumn>
          <TableColumn className="bg-[#0C295F] text-white">Gudang Tujuan</TableColumn>
          <TableColumn className="bg-[#0C295F] text-white">Action</TableColumn>
        </TableHeader>
        <TableBody>
          {responseData.item.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>
                <div className="relative">
                  <textarea
                    value={item.name}
                    name="name"
                    className="w-full p-2 border border-black-500 rounded resize-none"
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(e as unknown as React.ChangeEvent<HTMLInputElement>, index)}
                    placeholder="Nama Barang"
                    autoComplete="off"
                  />
                  {suggestions[index]?.length > 0 && (
                    <div className="absolute bg-white border mt-2 w-full shadow-lg z-10">
                      {suggestions[index].map((suggestion, i) => (
                        <div
                          key={i}
                          className="cursor-pointer p-2 hover:bg-gray-100"
                          onClick={() => {
                            setResponseData((prevData) => {
                              const updatedItems = [...prevData.item];
                              updatedItems[index].name = suggestion;
                              return { ...prevData, item: updatedItems };
                            });
                            updatePriceForItem(index, suggestion);
                            setSuggestions((prev) => ({ ...prev, [index]: [] }));
                          }}
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
                  value={item.kode}
                  className="w-full p-2 border border-black-500 rounded resize-none"
                  name="kode"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(e as unknown as React.ChangeEvent<HTMLInputElement>, index)}
                  placeholder="Kode"
                />
              </TableCell>
              <TableCell>
                <textarea
                  value={item.variable}
                  className="w-full p-2 border border-black-500 rounded resize-none"
                  name="variable"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(e as unknown as React.ChangeEvent<HTMLInputElement>, index)}
                  placeholder="Variable"
                />
              </TableCell>
              <TableCell>
                <textarea
                  value={item.quantity}
                  className="w-full p-2 border border-black-500 rounded resize-none"
                  name="quantity"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(e as unknown as React.ChangeEvent<HTMLInputElement>, index)}
                  placeholder="Quantity"
                />
              </TableCell>
              <TableCell>
                <textarea
                  value={item.price}
                  className="w-full p-2 border border-black-500 rounded resize-none"
                  name="price"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(e as unknown as React.ChangeEvent<HTMLInputElement>, index)}
                  placeholder="Harga Satuan"
                />
              </TableCell>
              <TableCell>
              <select
                  value={item.gudang}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    handleFieldChange(e as unknown as React.ChangeEvent<HTMLInputElement>, item.id);
                    setGudang(e.target.value);
                  }}
                  name="gudang"
                  id="123"
                  className="w-full px-5 py-4 border border-black-500 rounded resize-none"
                >
                  <option value="">Pilih Gudang Tujuan</option>
                  {
                    gudangList.map((gudang) => (
                      <option key={gudang.id} value={gudang.nama_gudang}>
                        {gudang.nama_gudang}
                      </option>
                    ))
                  }
                </select>
              </TableCell>
              <TableCell>
                <Tooltip content="Delete" className="text-black">
                  <span
                    className="cursor-pointer text-lg text-default-400 active:opacity-50"
                    onClick={() => handleDelete(index)}
                  >
                    <DeleteIcon />
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end gap-4">
        <Button className="bg-red-600 text-white" onClick={tolak}>
          Batalkan
        </Button>
        <Button className="bg-green-500 text-white" onClick={submitAcc}>
          Lanjutkan
        </Button>
      </div>
    </div>
  );
};

export default AdminMainContent;
