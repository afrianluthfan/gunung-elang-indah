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
import Swal from "sweetalert2";
import { DeleteIcon } from "../../../components/Tables/AdminTable/DeleteIcon";

type ItemDetail = {
  kat: string;
  nama_barang: string;
  quantity: string;
  harga_satuan: string;
  discount: string;
};

type PurchaseOrder = {
  id_divisi: string;
  rumah_sakit: string;
  alamat: string;
  jatuh_tempo: string;
  nama_dokter: string;
  nama_pasien: string;
  rm: string;
  id_rumah_sakit: string;
  tanggal_tindakan: string;
  item: ItemDetail[];
  item_deleted: { kat: string }[];
};

const AdminMainContent = () => {
  const router = useRouter();
  const [responseData, setResponseData] = useState<PurchaseOrder>({
    id_divisi: "",
    rumah_sakit: "",
    alamat: "",
    jatuh_tempo: "",
    nama_dokter: "",
    nama_pasien: "",
    rm: "",
    id_rumah_sakit: "",
    tanggal_tindakan: "",
    item: [],
    item_deleted: [],
  });

  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [stockData, setStockData] = useState<any[]>([]);
  const [hospitalData, setHospitalData] = useState<any[]>([]);
  const [itemSuggestions, setItemSuggestions] = useState<{ [key: string]: string[] }>({});
  const [hospitalSuggestions, setHospitalSuggestions] = useState<string[]>([]);
  const [selectedDivisi, setSelectedDivisi] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const res = await axios.post("http://209.182.237.155:8080/api/stock-barang/list");
        setStockData(res.data.data);
      } catch (error) {
        console.error("Error fetching stock data", error);
      }
    };

    const fetchHospitalData = async () => {
      try {
        const res = await axios.post("http://209.182.237.155:8080/api/proforma-invoice/rs-list");
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
      const submitData = async () => {
        try {
          const res = await axios.post(
            "http://209.182.237.155:8080/api/proforma-invoice/inquiry",
            responseData
          );

          localStorage.setItem("purchaseOrder", JSON.stringify(res));
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
        text: "Apakah kamu yakin ingin menghapus barang ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          const deletedItem = responseData.item[index];
          setResponseData((prevData) => ({
            ...prevData,
            item: prevData.item.filter((_, idx) => idx !== index),
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
          item: prevData.item.map((item, idx) =>
            idx === index ? { ...item, [name]: value } : item
          ),
        };
      }
    });

    if (name === "nama_barang" && value.length > 1) {
      const filteredSuggestions = stockData
        .filter((item: { name: string }) => item.name && item.name.toLowerCase().includes(value.toLowerCase()))
        .map((item: { name: string }) => item.name);
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

    if (name === "rumah_sakit" && value.length > 1) {
      const filteredHospitalSuggestions = hospitalData
        .filter((hospital: { name: string }) => hospital.name && hospital.name.toLowerCase().includes(value.toLowerCase()))
        .map((hospital: { name: string }) => hospital.name);
      setHospitalSuggestions(filteredHospitalSuggestions);
    } else if (name === "rumah_sakit") {
      setHospitalSuggestions([]);
    }
  };

  const handleAddItem = () => {
    setResponseData((prevData) => ({
      ...prevData,
      item: [
        ...prevData.item,
        {
          kat: "",
          nama_barang: "",
          quantity: "",
          harga_satuan: "",
          discount: "",
        },
      ],
    }));
  };

  const submitAcc = () => {
    setShouldSubmit(true);
  };

  const handleSuggestionClick = (suggestion: string, index: number) => {
    const selectedItem = stockData.find((item) => item.name === suggestion);
    if (selectedItem) {
      setResponseData((prevData) => ({
        ...prevData,
        item: prevData.item.map((item, idx) =>
          idx === index
            ? {
              ...item,
              nama_barang: selectedItem.name,
              harga_satuan: selectedItem.price.toString(), // Convert to string if needed
            }
            : item
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
        rumah_sakit: selectedHospital.name,
        alamat: selectedHospital.address_company,
        id_rumah_sakit: selectedHospital.id.toString(), // Menyetel ID Rumah Sakit secara otomatis
      }));
      setHospitalSuggestions([]);
    }
  };

  const handleDivisiChange = (divisi: string) => {
    setSelectedDivisi(divisi);
    setDropdownOpen(false);
    setResponseData((prevData) => ({
      ...prevData,
      id_divisi: divisi,
      rumah_sakit: "",
      alamat: "",
      jatuh_tempo: "",
      nama_dokter: "",
      nama_pasien: "",
      rm: "",
      id_rumah_sakit: "",
      tanggal_tindakan: "",
      item: [],
      item_deleted: [],
    }));
  };

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        <div className="flex w-full  justify-between">
          <h1 className="text-xl font-bold lg:text-[1.85vh] mt-2">Form Tambah Proforma Invoice</h1>

          <div className="flex justify-start">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-2 border border-blue-900 rounded-lg bg-blue-900 text-white"
              >
                {selectedDivisi ? selectedDivisi : "Pilih Divisi"}
              </button>
              {dropdownOpen && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full">
                  <li
                    onClick={() => handleDivisiChange("Ortopedi")}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    Ortopedi
                  </li>
                  <li
                    onClick={() => handleDivisiChange("Radiologi")}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    Radiologi
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </ContentTopSectionLayout>
      <Divider />
      {selectedDivisi == "Ortopedi" && (
        <>
          <div className="flex gap-4">
            <div className="flex flex-col space-y-2 w-full md:w-1/3">
              <label className="text-left">Nama Perusahaan</label>
              <Input
                value={responseData.rumah_sakit}
                name="rumah_sakit"
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
                value={responseData.alamat}
                name="alamat"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="Alamat"
                className="py-2"
              />
            </div>
            <div className="flex flex-col space-y-2 w-full md:w-1/3">
              <label className="text-left">Tanggal Jatuh Tempo:</label>
              <Input
                type="date"
                value={responseData.jatuh_tempo}
                name="jatuh_tempo"
                onChange={(e) => handleFieldChange(e, -1)}
                className="py-2"
              />
            </div>
          </div>
          <div className="flex gap-4 ">
            <div className="flex flex-col space-y-2 w-full md:w-1/3">
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
                <TableColumn className="bg-blue-900 text-white">Nomor Katalog</TableColumn>
                <TableColumn className="bg-blue-900 text-white">Nama Barang</TableColumn>
                <TableColumn className="bg-blue-900 text-white">Quantity</TableColumn>
                <TableColumn className="bg-blue-900 text-white">Harga Satuan</TableColumn>
                <TableColumn className="bg-blue-900 text-white">Diskon</TableColumn>
                <TableColumn className="bg-blue-900 text-white">Action</TableColumn>
              </TableHeader>
              <TableBody>
                {responseData.item.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={row.kat}
                        name="kat"
                        onChange={(e) => handleFieldChange(e, index)}
                        placeholder="Nomor Katalog"
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
      {selectedDivisi === "Radiologi" && (
        <>
          {/* Konten untuk divisi Radiologi */}
          <div className="flex gap-4">
            <div className="flex flex-col space-y-2 w-full md:w-1/3">
              <label className="text-left">Nama Perusahaan</label>
              <Input
                value={responseData.rumah_sakit}
                name="rumah_sakit"
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
                value={responseData.alamat}
                name="alamat"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="Alamat"
                className="py-2"
              />
            </div>
            <div className="flex flex-col space-y-2 w-full md:w-1/3">
              <label className="text-left">Tanggal Jatuh Tempo:</label>
              <Input
                type="date"
                value={responseData.jatuh_tempo}
                name="jatuh_tempo"
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
                <TableColumn className="bg-blue-900 text-white">Nomor Katalog</TableColumn>
                <TableColumn className="bg-blue-900 text-white">Nama Barang</TableColumn>
                <TableColumn className="bg-blue-900 text-white">Quantity</TableColumn>
                <TableColumn className="bg-blue-900 text-white">Harga Satuan</TableColumn>
                <TableColumn className="bg-blue-900 text-white">Diskon</TableColumn>
                <TableColumn className="bg-blue-900 text-white">Action</TableColumn>
              </TableHeader>
              <TableBody>
                {responseData.item.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={row.kat}
                        name="kat"
                        onChange={(e) => handleFieldChange(e, index)}
                        placeholder="Nomor Katalog"
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
