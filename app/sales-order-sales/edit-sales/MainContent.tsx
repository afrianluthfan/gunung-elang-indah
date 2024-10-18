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
  gudang: string | number | readonly string[] | undefined;
  kode: string | (readonly string[] & string) | undefined;
  variable: string | (readonly string[] & string) | undefined;
  id: number;
  kat: string;
  nama_barang: string;
  quantity: string;
  harga_satuan: string;
  discount: string;
  sub_total_item: string;
}

type Gudang = {
  id: number;
  nama_gudang: string;
  alamat_gudang: string;
};

type PurchaseOrder = {
  id: number;
  customer_id: number;
  status: string;
  id_divisi: string;
  invoice_number: string;
  due_date: string;
  nama_dokter: string;
  nama_pasien: string;
  tanggal_tindakan: string;
  rm: string;
  number_si: string;
  sub_total: string;
  pajak: string;
  total: string;
  rumah_sakit: string;
  alamat: string;
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
    id_divisi: "",
    invoice_number: "",
    due_date: "",
    nama_dokter: "",
    nama_pasien: "",
    tanggal_tindakan: "",
    rm: "",
    number_si: "",
    sub_total: "",
    pajak: "",
    total: "",
    rumah_sakit: "",
    alamat: "",
    reason: "",
    item_detail_pi: [],
    item_deleted: [],
  });

  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [stockData, setStockData] = useState<any[]>([]);
  const [hospitalData, setHospitalData] = useState<any[]>([]);
  const [itemSuggestions, setItemSuggestions] = useState<{
    [key: string]: string[];
  }>({});
  const [hospitalSuggestions, setHospitalSuggestions] = useState<string[]>([]);
  const [selectedDivisi, setSelectedDivisi] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // INI ADALAH KEPERLUAN LOGIC DOKTER
  const [doctorData, setDoctorData] = useState<any[]>([]);
  const [doctorSuggestions, setDoctorSuggestions] = useState<string[]>([]);

  // get query url id dan divisi
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const divisi = searchParams.get("divisi");

  // INI ADALAH KEPERLUAN LOGIC GUDANG
  const [GUDANG, setGudang] = useState("");

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (responseData.rumah_sakit) {
        try {
          const res = await axios.post(
            "http://localhost:8080/api/proforma-invoice/dr-list",
            {
              nama: responseData.rumah_sakit,
            },
          );
          setDoctorData(res.data.data);
          setDoctorSuggestions(
            res.data.data.map(
              (doctor: { namaDokter: string }) => doctor.namaDokter,
            ),
          );
        } catch (error) {
          console.error("Error fetching doctor data", error);
        }

        try {
          const res = await axios.post(
            "http://localhost:8080/api/price/ListByCustomer",
            {
              nama: responseData.rumah_sakit,
            },
          );
          setStockData(res.data.data);
        } catch (error) {
          console.error("Error fetching stock data", error);
        }
      }
    };

    fetchDoctorData();
  }, [responseData.rumah_sakit]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8080/api/proforma-invoice/detailPI",
          {
            id: id,
            divisi: divisi,
          },
        );

        console.log("Nama Docter", res.data.data.nama_dokter);
        // Deklarasi variabel dengan type purchase order

        setResponseData(res.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8080/api/stock-barang/list",
        );
        setStockData(res.data.data);
      } catch (error) {
        console.error("Error fetching stock data", error);
      }
    };

    const fetchHospitalData = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8080/api/proforma-invoice/rs-listc",
        );
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
            responseData,
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
            item_detail_pi: prevData.item_detail_pi.filter(
              (_, idx) => idx !== index,
            ),
            item_deleted: Array.isArray(prevData.item_deleted)
              ? [...prevData.item_deleted, { kat: deletedItem.kat }]
              : [{ kat: deletedItem.kat }],
          }));
        }
      });
    }
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
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
            idx === index
              ? { ...item_detail_pi, [name]: value }
              : item_detail_pi,
          ),
        };
      }
    });

    if (name === "nama_barang" && value.length > 1) {
      const filteredSuggestions = stockData
        .filter(
          (item_detail_pi: { name: string }) =>
            item_detail_pi.name &&
            item_detail_pi.name.toLowerCase().includes(value.toLowerCase()),
        )
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

    if (name === "rumah_sakit" && value.length > 1) {
      const filteredHospitalSuggestions = hospitalData
        .filter(
          (hospital: { name: string }) =>
            hospital.name &&
            hospital.name.toLowerCase().includes(value.toLowerCase()),
        )
        .map((hospital: { name: string }) => hospital.name);
      setHospitalSuggestions(filteredHospitalSuggestions);
    } else if (name === "rumah_sakit") {
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
          sub_total_item: "0",
          kode: "",
          variable: "",
          gudang: "", // Add the missing 'gudang' property
        },
      ],
    }));
  };

  const submitAcc = () => {
    setShouldSubmit(true);
  };

  const handleSuggestionClick = (suggestion: string, index: number) => {
    const selectedItem = stockData.find(
      (item_detail_pi) => item_detail_pi.name === suggestion,
    );
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
            : item_detail_pi,
        ),
      }));
      setItemSuggestions((prevSuggestions) => ({
        ...prevSuggestions,
        [index]: [],
      }));
    }
  };

  const handleHospitalSuggestionClick = (suggestion: string) => {
    const selectedHospital = hospitalData.find(
      (hospital) => hospital.name === suggestion,
    );
    if (selectedHospital) {
      setResponseData((prevData) => ({
        ...prevData,
        rumah_sakit: selectedHospital.name,
        alamat: selectedHospital.address_company,
        customer_id: selectedHospital.id, // Menyetel ID Rumah Sakit secara otomatis
      }));
      setHospitalSuggestions([]);
    }
  };


  const [gudangList, setGudangList] = useState<Gudang[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGudangList = async () => {
      try {
        const response = await axios.post(
          `http://localhost:8080/api/gudang/list`
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
          <div
            className="mb-4 border-l-4 border-red-500 bg-red-100 p-4 text-red-700"
            role="alert"
          >
            <p className="font-bold">Alasan Penolakan:</p>
            <p>{responseData.reason}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between text-">
        <h1 className="text-xl font-semibold mt-2">Edit Purchase Order</h1>
        <Button color="primary" onClick={submitAcc}>
          Simpan
        </Button>
      </div>
      <Divider />

      {divisi == "Ortopedi" && (
        <>
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex w-full flex-col space-y-2 md:w-1/3">
              <label className="text-left">Nama Perusahaan</label>

              <Input
                value={responseData.rumah_sakit}
                name="rumah_sakit"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="Nama Perusahaan"
                className="flex-1 rounded-md border border-gray-300 px-2 py-2 outline-none"
                endContent={
                  <button
                    className="opacity-75"
                    type="button"
                    onClick={() => {
                      const allSuggestions = hospitalData.map(
                        (hospital: { name: string }) => hospital.name,
                      );
                      setHospitalSuggestions(
                        (prevSuggestions) =>
                          prevSuggestions.length > 0 ? [] : allSuggestions, // Toggle suggestions
                      );
                    }}
                  >
                    ▼
                  </button>
                }
              />

              {/* Dropdown Suggestions */}
              {hospitalSuggestions.length > 0 && (
                <ul className="absolute top-[4.8rem] z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-2xl border border-gray-300 bg-white">
                  {hospitalSuggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleHospitalSuggestionClick(suggestion)}
                      className="cursor-pointer p-2 hover:bg-gray-200"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex w-full flex-col space-y-2 md:w-1/3">
              <label className="text-left">Alamat:</label>
              <Input
                value={responseData.alamat}
                name="alamat"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="Alamat"
                className="flex-1 rounded-md border border-gray-300 px-2 py-2 outline-none"
              />
            </div>
            <div className="flex w-full flex-col space-y-2 md:w-1/3">
              <label className="text-left">Tanggal Tindakan:</label>
              <Input
                type="date"
                value={responseData.tanggal_tindakan}
                name="tanggal_tindakan"
                onChange={(e) => handleFieldChange(e, -1)}
                className="flex-1 rounded-md border border-gray-300 px-2 py-2 outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex w-full flex-col space-y-2 md:w-1/3">
              <label className="text-left">Nama Dokter:</label>
              <Input
                value={responseData.nama_dokter}
                name="nama_dokter"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="Nama Dokter"
                className="flex-1 rounded-md border border-gray-300 px-2 py-2 outline-none"
                endContent={
                  <button
                    className="opacity-75"
                    type="button"
                    onClick={() => {
                      setDoctorSuggestions(
                        doctorSuggestions.length > 0
                          ? []
                          : doctorData.map((doctor) => doctor.nama_dokter),
                      );
                    }}
                  >
                    ▼
                  </button>
                }
              />
              {doctorSuggestions.length > 0 && (
                <ul className="absolute top-[5rem] z-[100] mt-1 max-h-48 w-full overflow-y-auto rounded-2xl border border-gray-300 bg-white">
                  {doctorSuggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setResponseData((prevData) => ({
                          ...prevData,
                          nama_dokter: suggestion,
                        }));
                        setDoctorSuggestions([]);
                      }}
                      className="cursor-pointer p-2 hover:bg-gray-200"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex w-full flex-col space-y-2 md:w-1/3">
              <label className="text-left">Nama Pasien:</label>
              <Input
                value={responseData.nama_pasien}
                name="nama_pasien"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="Nama Pasien"
                className="flex-1 rounded-md border border-gray-300 px-2 py-2 outline-none"
              />
            </div>
            <div className="flex w-full flex-col space-y-2 md:w-1/3">
              <label className="text-left">RM:</label>
              <Input
                value={responseData.rm}
                name="rm"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="RM"
                className="flex-1 rounded-md border border-gray-300 px-2 py-2 outline-none"
              />
            </div>
          </div>

          <Divider />

          <div className="flex justify-end">
            <Button className="bg-blue-900 text-white" onClick={handleAddItem}>
              Tambah Barang
            </Button>
          </div>

          <div className="flex items-center justify-between overflow-x-scroll pb-[200px]">
            <Table
              aria-label="Table Barang"
              className="min-w-full divide-y divide-gray-200"
              isHeaderSticky
              removeWrapper
            >
              <TableHeader>
                <TableColumn className="bg-blue-900 text-white">
                  Gudang Asal
                </TableColumn>

                <TableColumn className="bg-blue-900 text-white">
                  Nama Barang
                </TableColumn>

                <TableColumn className="bg-blue-900 text-white">
                  Quantity
                </TableColumn>

                <TableColumn className="bg-blue-900 text-white">
                  Action
                </TableColumn>
              </TableHeader>
              <TableBody>
                {responseData.item_detail_pi.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                    <select
                        value={row.gudang}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          handleFieldChange(e as unknown as React.ChangeEvent<HTMLInputElement>, index);
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
                      <div className="relative w-full">

                        <Input
                          value={row.nama_barang}
                          name="nama_barang"
                          onChange={(e) => handleFieldChange(e, index)}
                          placeholder="Nama Barang"
                          className="flex-1 border-none px-2 py-2 outline-none"
                          endContent={
                            <button
                              className="opacity-75"
                              type="button"
                              onClick={() => {
                                const allSuggestions = stockData.map(
                                  (item: { name: string }) => item.name,
                                );
                                setItemSuggestions((prevSuggestions) => ({
                                  ...prevSuggestions,
                                  [index]:
                                    prevSuggestions[index] &&
                                      prevSuggestions[index].length > 0
                                      ? []
                                      : allSuggestions,
                                }));
                              }}
                            >
                              ▼
                            </button>
                          }
                        />
                        {/* Dropdown Suggestions */}
                        {itemSuggestions[index] &&
                          itemSuggestions[index].length > 0 && (
                            <ul className="absolute z-[100] mt-1 max-h-48 w-full overflow-y-scroll rounded-2xl border border-gray-300 bg-white">
                              {itemSuggestions[index].map((suggestion, idx) => (
                                <li
                                  key={idx}
                                  onClick={() =>
                                    handleSuggestionClick(suggestion, index)
                                  }
                                  className="cursor-pointer p-2 hover:bg-gray-200"
                                >
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          )}
                      </div>
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

        </>
      )}
      {divisi === "Radiologi" && (
        <>
          {/* Konten untuk divisi Radiologi */}
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex w-full flex-col space-y-2 md:w-1/3">
              <label className="text-left">Nama Perusahaan</label>
              <Input
                value={responseData.rumah_sakit}
                name="rumah_sakit"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="Nama Perusahaan"
                className="py-2"
              />
              {hospitalSuggestions.length > 0 && (
                <ul className="absolute z-[100] mt-1 max-h-48 overflow-y-auto rounded border border-gray-300 bg-white">
                  {hospitalSuggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleHospitalSuggestionClick(suggestion)}
                      className="cursor-pointer p-2 hover:bg-gray-200"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex w-full flex-col space-y-2 md:w-1/3">
              <label className="text-left">Alamat:</label>
              <Input
                value={responseData.alamat}
                name="alamat"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="Alamat"
                className="py-2"
              />
            </div>
            {/* <div className="flex w-full flex-col space-y-2 md:w-1/3">
              <label className="text-left">Tanggal Tindakan:</label>
              <Input
                type="date"
                value={responseData.tanggal_tindakan}
                name="tanggal_tindakan"
                onChange={(e) => handleFieldChange(e, -1)}
                className="py-2"
              />
            </div> */}
             <div className="flex w-full flex-col space-y-2 md:w-1/3">
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
          <div className="flex flex-col gap-4 lg:flex-row">
           
          </div>

          <Divider />

          <div className="flex justify-end">
            <Button className="bg-blue-900 text-white" onClick={handleAddItem}>
              Tambah Barang
            </Button>
          </div>

          <div className="flex items-center justify-between overflow-x-scroll mb-10">
            <Table
              aria-label="Table Barang"
              className="min-w-full divide-y divide-gray-200"
              isHeaderSticky
              removeWrapper
            >
              <TableHeader>
                <TableColumn className="bg-blue-900 text-white">
                  Gudang Asal
                </TableColumn>
                <TableColumn className="bg-blue-900 text-white">
                  Nama Barang
                </TableColumn>

                <TableColumn className="bg-blue-900 text-white">
                  Quantity
                </TableColumn>


                <TableColumn className="bg-blue-900 text-white">
                  Action
                </TableColumn>
              </TableHeader>
              <TableBody>
                {responseData.item_detail_pi.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <select
                        value={row.gudang}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          handleFieldChange(e as unknown as React.ChangeEvent<HTMLInputElement>, index);
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
                      <div className="relative w-full">

                        <Input
                          value={row.nama_barang}
                          name="nama_barang"
                          onChange={(e) => handleFieldChange(e, index)}
                          placeholder="Nama Barang"
                          className="flex-1 border-none px-2 py-2 outline-none"
                          endContent={
                            <button
                              className="opacity-75"
                              type="button"
                              onClick={() => {
                                const allSuggestions = stockData.map(
                                  (item: { name: string }) => item.name,
                                );
                                setItemSuggestions((prevSuggestions) => ({
                                  ...prevSuggestions,
                                  [index]:
                                    prevSuggestions[index] &&
                                      prevSuggestions[index].length > 0
                                      ? []
                                      : allSuggestions,
                                }));
                              }}
                            >
                              ▼
                            </button>
                          }
                        />
                        {/* Dropdown Suggestions */}
                        {itemSuggestions[index] &&
                          itemSuggestions[index].length > 0 && (
                            <ul className="absolute z-[100] mt-1 max-h-48 w-full overflow-y-scroll rounded-2xl border border-gray-300 bg-white">
                              {itemSuggestions[index].map((suggestion, idx) => (
                                <li
                                  key={idx}
                                  onClick={() =>
                                    handleSuggestionClick(suggestion, index)
                                  }
                                  className="cursor-pointer p-2 hover:bg-gray-200"
                                >
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          )}
                      </div>
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
        </>
      )}
    </div>
  );
};

export default AdminMainContent;
