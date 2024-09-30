import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import Swal from "sweetalert2";
import { DeleteIcon } from "../../../components/Tables/AdminTable/DeleteIcon";

interface ItemDetailPI {
  id: number;
  kat: string;
  nama_barang: string;
  quantity: string;
  harga_satuan: string;
  discount: string;
  sub_total_item: string;
}

type PurchaseOrder = {
  id: number;
  customer_id: number;
  status: string;
  divisi: string;
  invoice_number: string;
  due_date: string;
  doctor_name: string;
  patient_name: string;
  tanggal_tindakan: string;
  rm: string;
  number_si: string;
  sub_total: string;
  pajak: string;
  total: string;
  nama_customer: string;
  alamat_customer: string;
  reason: string;
  item_detail_pi: ItemDetailPI[];
  item_deleted: { kat: string }[];
};

const AdminMainContent = () => {
  const router = useRouter();
  const [responseData, setResponseData] = useState<PurchaseOrder>({
    id: 0,
    customer_id: 0,
    status: "",
    divisi: "",
    invoice_number: "",
    due_date: "",
    doctor_name: "",
    patient_name: "",
    tanggal_tindakan: "",
    rm: "",
    number_si: "",
    sub_total: "",
    pajak: "",
    total: "",
    nama_customer: "",
    alamat_customer: "",
    reason: "",
    item_detail_pi: [],
    item_deleted: [],
  });

  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [stockData, setStockData] = useState<any[]>([]);
  const [hospitalData, setHospitalData] = useState<any[]>([]);
  const [itemSuggestions, setItemSuggestions] = useState<{ [key: string]: string[] }>({});
  const [hospitalSuggestions, setHospitalSuggestions] = useState<string[]>([]);
  const [selectedDivisi, setSelectedDivisi] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // get query url id dan divisi 
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const divisi = searchParams.get("divisi");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post("http://localhost:8080/api/proforma-invoice/detailPI", {
          id: id,
          divisi: divisi,
        });

        console.log("Nama Docter", res.data.data.doctor_name);
        // Deklarasi variabel dengan type purchase order 

        setResponseData(res.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }

    fetchData();
  }, [])


  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const res = await axios.post("http://localhost:8080/api/stock-barang/list");
        setStockData(res.data.data);
      } catch (error) {
        console.error("Error fetching stock data", error);
      }
    };

    const fetchHospitalData = async () => {
      try {
        const res = await axios.post("http://localhost:8080/api/proforma-invoice/rs-list");
        setHospitalData(res.data.data);
      } catch (error) {
        console.error("Error fetching hospital data", error);
      }
    };

    fetchStockData();
    fetchHospitalData();
  }, []);

  useEffect(() => {
    if (shouldSubmit) {

      if (responseData.item_detail_pi.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Tidak ada item yang dipilih",
        });
        return;
      }

      const submitData = async () => {
        try {
          const res = await axios.post(
            "http://localhost:8080/api/proforma-invoice/editPI-inquiry",
            responseData
          );

          localStorage.setItem("purchaseOrder", JSON.stringify(res));
          localStorage.setItem("aksi", "update");
          router.push("/proforma-invoice-dua/form/preview");
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
    if (index !== undefined) {
      Swal.fire({
        title: "Apakah Kamu Yakin?",
        text: "Apakah kamu yakin ingin menghapus ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          const deletedItem = responseData.item_detail_pi[index];
          setResponseData((prevData) => ({
            ...prevData,
            item_detail_pi: prevData.item_detail_pi.filter((_, idx) => idx !== index),
            item_deleted: Array.isArray(prevData.item_deleted)
              ? [...prevData.item_deleted, { kat: deletedItem.kat }]
              : [{ kat: deletedItem.kat }],
          }));
        }
      });
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;

    setResponseData((prevData) => {
      if (index === -1) {
        return {
          ...prevData,
          [name]: value,
        };
      } else {
        return {
          ...prevData,
          item_detail_pi: prevData.item_detail_pi.map((item_detail_pi, idx) =>
            idx === index ? { ...item_detail_pi, [name]: value } : item_detail_pi
          ),
        };
      }
    });

    if (name === "nama_barang" && value.length > 1) {
      const filteredSuggestions = stockData
        .filter((item_detail_pi: { name: string }) => item_detail_pi.name && item_detail_pi.name.toLowerCase().includes(value.toLowerCase()))
        .map((item_detail_pi: { name: string }) => item_detail_pi.name);
      setItemSuggestions((prevSuggestions) => ({
        ...prevSuggestions,
        [index]: filteredSuggestions,
      }));
    } else if (name === "nama_barang") {
      setItemSuggestions((prevSuggestions) => ({
        ...prevSuggestions,
        [index]: [],
      }));
    }

    if (name === "nama_customer" && value.length > 1) {
      const filteredHospitalSuggestions = hospitalData
        .filter((hospital: { name: string }) => hospital.name && hospital.name.toLowerCase().includes(value.toLowerCase()))
        .map((hospital: { name: string }) => hospital.name);
      setHospitalSuggestions(filteredHospitalSuggestions);
    } else if (name === "nama_customer") {
      setHospitalSuggestions([]);
    }
  };

  const handleAddItem = () => {
    setResponseData((prevData: PurchaseOrder) => ({
      ...prevData,
      item_detail_pi: [
        ...prevData.item_detail_pi,
        {
          id: 0, // Assuming 0 is a valid temporary ID
          kat: "",
          nama_barang: "",
          quantity: "",
          harga_satuan: "",
          discount: "",
          sub_total_item: "0", // Changed to string to match ItemDetailPI type
        },
      ],
    }));
  };

  const submitAcc = () => {
    setShouldSubmit(true);
  };

  const handleSuggestionClick = (suggestion: string, index: number) => {
    const selectedItem = stockData.find((item_detail_pi) => item_detail_pi.name === suggestion);
    if (selectedItem) {
      setResponseData((prevData) => ({
        ...prevData,
        item_detail_pi: prevData.item_detail_pi.map((item_detail_pi, idx) =>
          idx === index
            ? {
              ...item_detail_pi,
              nama_barang: selectedItem.name,
              harga_satuan: selectedItem.price.toString(), // Convert to string if needed
            }
            : item_detail_pi
        ),
      }));
      setItemSuggestions((prevSuggestions) => ({
        ...prevSuggestions,
        [index]: [],
      }));
    }
  };

  const handleHospitalSuggestionClick = (suggestion: string) => {
    const selectedHospital = hospitalData.find((hospital) => hospital.name === suggestion);
    if (selectedHospital) {
      setResponseData((prevData) => ({
        ...prevData,
        nama_customer: selectedHospital.name,
        alamat_customer: selectedHospital.address_company,
        customer_id: selectedHospital.id, // Menyetel ID Rumah Sakit secara otomatis
      }));
      setHospitalSuggestions([]);
    }
  };

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
      {divisi == "Ortopedi" && (
        <>
          <div className="flex gap-4">
            <div className="flex flex-col space-y-2 w-full md:w-1/3">
              <label className="text-left">Nama Perusahaan</label>
              <Input
                value={responseData.nama_customer}
                name="nama_customer"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="Nama Perusahaan"
                className="py-2"
              />
              {hospitalSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto">
                  {hospitalSuggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleHospitalSuggestionClick(suggestion)}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex flex-col space-y-2 w-full md:w-1/3">
              <label className="text-left">Alamat:</label>
              <Input
                value={responseData.alamat_customer}
                name="alamat_customer"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="Alamat"
                className="py-2"
              />
            </div>
            <div className="flex flex-col space-y-2 w-full md:w-1/3">
              <label className="text-left">Tanggal Jatuh Tempo:</label>
              <Input
                type="date"
                value={responseData.due_date}
                name="due_date"
                onChange={(e) => handleFieldChange(e, -1)}
                className="py-2"
              />
            </div>
          </div>
          <div className="flex gap-4 ">
            <div className="flex flex-col space-y-2 w-full md:w-1/3">
              <label className="text-left">Nama Dokter:</label>
              <Input
                value={responseData.doctor_name}
                name="doctor_name"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="Nama Dokter"
                className="py-2"
              />
            </div>
            <div className="flex flex-col space-y-2 w-full md:w-1/3">
              <label className="text-left">Nama Pasien:</label>
              <Input
                value={responseData.patient_name}
                name="patient_name"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="Nama Pasien"
                className="py-2"
              />
            </div>
            <div className="flex flex-col space-y-2 w-full md:w-1/3">
              <label className="text-left">RM:</label>
              <Input
                value={responseData.rm}
                name="rm"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="RM"
                className="py-2"
              />
            </div>
          </div>
          <div className="flex gap-4 ">
            <div className="flex flex-col space-y-2 w-full md:w-1/3">
              <label className="text-left">Tanggal Tindakan:</label>
              <Input
                type="date"
                value={responseData.tanggal_tindakan}
                name="tanggal_tindakan"
                onChange={(e) => handleFieldChange(e, -1)}
                className="py-2"
              />
            </div>
          </div>

          <Divider />

          <div className="flex justify-end">
            <Button className="  bg-blue-900 text-white" onClick={handleAddItem}>
              Tambah Barang
            </Button>
          </div>

          <div className="">
            <Table
              aria-label="Table Barang"
              className="min-w-full divide-y divide-gray-200"
              isHeaderSticky
              removeWrapper

            >
              <TableHeader>
                <TableColumn className="bg-blue-900 text-white">Kode Barang</TableColumn>
                <TableColumn className="bg-blue-900 text-white">Nama Barang</TableColumn>
                <TableColumn className="bg-blue-900 text-white">Quantity</TableColumn>
                <TableColumn className="bg-blue-900 text-white">Harga Satuan</TableColumn>
                <TableColumn className="bg-blue-900 text-white">Diskon</TableColumn>
                <TableColumn className="bg-blue-900 text-white">Action</TableColumn>
              </TableHeader>
              <TableBody>
                {responseData.item_detail_pi.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={row.kat}
                        name="kat"
                        onChange={(e) => handleFieldChange(e, index)}
                        placeholder="Kode Barang"
                        className="py-2"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.nama_barang}
                        name="nama_barang"
                        onChange={(e) => handleFieldChange(e, index)}
                        placeholder="Nama Barang"
                        className="py-2"
                      />
                      {itemSuggestions[index] && itemSuggestions[index].length > 0 && (
                        <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto">
                          {itemSuggestions[index].map((suggestion, idx) => (
                            <li
                              key={idx}
                              onClick={() => handleSuggestionClick(suggestion, index)}
                              className="p-2 cursor-pointer hover:bg-gray-200"
                            >
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.quantity}
                        name="quantity"
                        onChange={(e) => handleFieldChange(e, index)}
                        placeholder="Quantity"
                        className="py-2"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.harga_satuan}
                        name="harga_satuan"
                        onChange={(e) => handleFieldChange(e, index)}
                        placeholder="Harga Satuan"
                        className="py-2"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.discount}
                        name="discount"
                        onChange={(e) => handleFieldChange(e, index)}
                        placeholder="Diskon"
                        className="py-2"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip content="Delete item">
                        <span
                          className="cursor-pointer text-lg text-red-600"
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


          </div>
          <div className="flex justify-end mt-4">
            <Button color="primary" onClick={submitAcc}>
              Simpan
            </Button>
          </div>
        </>
      )}
      {divisi === "Radiologi" && (
        <>
          {/* Konten untuk divisi Radiologi */}
          <div className="flex gap-4">
            <div className="flex flex-col space-y-2 w-full md:w-1/3">
              <label className="text-left">Nama Perusahaan</label>
              <Input
                value={responseData.nama_customer}
                name="nama_customer"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="Nama Perusahaan"
                className="py-2"
              />
              {hospitalSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto">
                  {hospitalSuggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleHospitalSuggestionClick(suggestion)}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex flex-col space-y-2 w-full md:w-1/3">
              <label className="text-left">Alamat:</label>
              <Input
                value={responseData.alamat_customer}
                name="alamat_customer"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="Alamat"
                className="py-2"
              />
            </div>
            <div className="flex flex-col space-y-2 w-full md:w-1/3">
              <label className="text-left">Tanggal Jatuh Tempo:</label>
              <Input
                type="date"
                value={responseData.due_date}
                name="due_date"
                onChange={(e) => handleFieldChange(e, -1)}
                className="py-2"
              />
            </div>
          </div>
          <div className="flex gap-4 ">
            {/* <div className="flex flex-col space-y-2 w-full md:w-1/3">
              <label className="text-left">Nama Dokter:</label>
              <Input
                value={responseData.nama_dokter}
                name="nama_dokter"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="Nama Dokter"
                className="py-2"
              />
            </div>
            <div className="flex flex-col space-y-2 w-full md:w-1/3">
              <label className="text-left">Nama Pasien:</label>
              <Input
                value={responseData.nama_pasien}
                name="nama_pasien"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="Nama Pasien"
                className="py-2"
              />
            </div> */}
            <div className="flex flex-col space-y-2 w-full md:w-1/3">
              <label className="text-left">RM:</label>
              <Input
                value={responseData.rm}
                name="rm"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="RM"
                className="py-2"
              />
            </div>
          </div>
          {/* <div className="flex gap-4 ">
            <div className="flex flex-col space-y-2 w-full md:w-1/3">
              <label className="text-left">Tanggal Tindakan:</label>
              <Input
                type="date"
                value={responseData.tanggal_tindakan}
                name="tanggal_tindakan"
                onChange={(e) => handleFieldChange(e, -1)}
                className="py-2"
              />
            </div>
          </div> */}

          <Divider />

          <div className="flex justify-end">
            <Button className="  bg-blue-900 text-white" onClick={handleAddItem}>
              Tambah Barang
            </Button>
          </div>

          <div className="">
            <Table
              aria-label="Table Barang"
              className="min-w-full divide-y divide-gray-200"
              isHeaderSticky
              removeWrapper

            >
              <TableHeader>
                <TableColumn className="bg-blue-900 text-white">Kode Barang</TableColumn>
                <TableColumn className="bg-blue-900 text-white">Nama Barang</TableColumn>
                <TableColumn className="bg-blue-900 text-white">Quantity</TableColumn>
                <TableColumn className="bg-blue-900 text-white">Harga Satuan</TableColumn>
                <TableColumn className="bg-blue-900 text-white">Diskon</TableColumn>
                <TableColumn className="bg-blue-900 text-white">Action</TableColumn>
              </TableHeader>
              <TableBody>
                {responseData.item_detail_pi.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={row.kat}
                        name="kat"
                        onChange={(e) => handleFieldChange(e, index)}
                        placeholder="Kode Barang"
                        className="py-2"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.nama_barang}
                        name="nama_barang"
                        onChange={(e) => handleFieldChange(e, index)}
                        placeholder="Nama Barang"
                        className="py-2"
                      />
                      {itemSuggestions[index] && itemSuggestions[index].length > 0 && (
                        <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto">
                          {itemSuggestions[index].map((suggestion, idx) => (
                            <li
                              key={idx}
                              onClick={() => handleSuggestionClick(suggestion, index)}
                              className="p-2 cursor-pointer hover:bg-gray-200"
                            >
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.quantity}
                        name="quantity"
                        onChange={(e) => handleFieldChange(e, index)}
                        placeholder="Quantity"
                        className="py-2"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.harga_satuan}
                        name="harga_satuan"
                        onChange={(e) => handleFieldChange(e, index)}
                        placeholder="Harga Satuan"
                        className="py-2"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.discount}
                        name="discount"
                        onChange={(e) => handleFieldChange(e, index)}
                        placeholder="Diskon"
                        className="py-2"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip content="Delete item">
                        <span
                          className="cursor-pointer text-lg text-red-600"
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


          </div>
          <div className="flex justify-end mt-4">
            <Button color="primary" onClick={submitAcc}>
              Simpan
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminMainContent;
