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
  gudang: string | (readonly string[] & string) | undefined;
  kode: string | (readonly string[] & string) | undefined;
  variable: string | (readonly string[] & string) | undefined;
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
  item_deleted: { kode: string }[];
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

  type Gudang = {
    id: number;
    nama_gudang: string;
    alamat_gudang: string;
  };

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

  // INI ADALAH KEPERLUAN LOGIC GUDANG
  const [GUDANG, setGudang] = useState("");

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (responseData.rumah_sakit) {
        try {
          const res = await axios.post(
            "http://209.182.237.155:8080/api/proforma-invoice/dr-list",
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
            "http://209.182.237.155:8080/api/price/ListByCustomer",
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
    const fetchHospitalData = async () => {
      try {
        const res = await axios.post(
          "http://209.182.237.155:8080/api/proforma-invoice/rs-listc",
        );
        setHospitalData(res.data.data);
      } catch (error) {
        console.error("Error fetching hospital data", error);
      }
    };

    fetchHospitalData();
  }, []);

  useEffect(() => {
    if (shouldSubmit) {
      if (responseData.item.length === 0) {
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
            "http://209.182.237.155:8080/api/proforma-invoice/inquiry",
            responseData,
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
  }, [shouldSubmit, responseData, router]);

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
              ? [...prevData.item_deleted, { kode: deletedItem.nama_barang || "" }]
              : [{ kode: deletedItem.nama_barang || "" }],
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
          item: prevData.item.map((item, idx) =>
            idx === index ? { ...item, [name]: value } : item,
          ),
        };
      }
    });

    if (name === "nama_barang" && value.length > 0) {
      const filteredSuggestions = stockData
        .filter((item: { name: string }) =>
          item.name.toLowerCase().includes(value.toLowerCase()),
        )
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
    setResponseData((prevData) => ({
      ...prevData,
      item: [
        ...prevData.item,
        {
          kode: "",
          kat: "",
          nama_barang: "",
          quantity: "",
          harga_satuan: "",
          discount: "",
          variable: "",
          gudang: "",
        },
      ],
    }));
  };

  function submitAcc() {
    setShouldSubmit(true);
  }

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
              kode: selectedItem.kode,
              variable: selectedItem.variable,
              discount: selectedItem.diskon, // Convert to string if needed
              harga_satuan: selectedItem.price.toString(), // Convert to string if needed
            }
            : item,
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

  const [gudangList, setGudangList] = useState<Gudang[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGudangList = async () => {
      try {
        const response = await axios.post(
          `http://209.182.237.155:8080/api/gudang/list`
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
      <ContentTopSectionLayout>
        <div className="flex w-full items-center justify-between">
          <h1 className="mt-2 max-w-32 font-bold lg:max-w-full lg:text-[1.85vh] lg:text-xl">
            Form Tambah Proforma Invoice
          </h1>

          <div className="flex justify-start">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="rounded-lg border border-blue-900 bg-blue-900 p-2 text-white"
              >
                {selectedDivisi ? selectedDivisi : "Pilih Divisi"}
              </button>
              {dropdownOpen && (
                <ul className="absolute z-10 mt-1 w-full rounded border border-gray-300 bg-white">
                  <li
                    onClick={() => handleDivisiChange("Ortopedi")}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                  >
                    Ortopedi
                  </li>
                  <li
                    onClick={() => handleDivisiChange("Radiologi")}
                    className="cursor-pointer p-2 hover:bg-gray-200"
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
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex w-full flex-col space-y-2 md:w-1/3">
              <label className="text-left text-sm lg:text-lg">
                Nama Perusahaan
              </label>

              <Input
                value={responseData.rumah_sakit}
                name="rumah_sakit"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="Nama Perusahaan"
                className="flex-1 rounded-md text-xs outline-none lg:border lg:border-gray-300 lg:px-2 lg:py-2 lg:text-lg"
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
                <ul className="absolute top-[4.8rem] z-[100] mt-1 max-h-48 w-full overflow-y-auto rounded-2xl border border-gray-300 bg-white">
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
              {/* <label className="text-left">Tanggal Jatuh Tempo:</label>
              <Input
                type="date"
                value={responseData.jatuh_tempo}
                name="jatuh_tempo"
                onChange={(e) => handleFieldChange(e, -1)}
                className="py-2"
              /> */}
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
                          : doctorData.map((doctor) => doctor.namaDokter),
                      );
                    }}
                  >
                    ▼
                  </button>
                }
              />
              {doctorSuggestions.length > 0 && (
                <ul className="absolute top-[5rem] z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-2xl border border-gray-300 bg-white">
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
              <label className="text-left">Rekam Medis:</label>
              <Input
                value={responseData.rm}
                name="rm"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="RM"
                className="flex-1 rounded-md border border-gray-300 px-2 py-2 outline-none"
              />
            </div>
          </div>
        </>
      )}

      {selectedDivisi == "Radiologi" && (
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
                <ul className="absolute top-[4.8rem] z-[100] mt-1 max-h-48 w-full overflow-y-auto rounded-2xl border border-gray-300 bg-white">
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
              <label className="text-left">Rekam Medis:</label>
              <Input
                value={responseData.rm}
                name="rm"
                onChange={(e) => handleFieldChange(e, -1)}
                placeholder="RM"
                className="flex-1 rounded-md border border-gray-300 px-2 py-2 outline-none"
              />
            </div>
          </div>

        </>
      )}

      <Divider />

      <div className="flex justify-end">
        <Button className="bg-blue-900 text-white" onClick={handleAddItem}>
          Tambah Barang
        </Button>
      </div>

      <div>
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
            {responseData.item.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="min-w-[150px] lg:min-w-fit">
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

                <TableCell className="min-w-[150px] lg:min-w-fit">
                  <div className="relative w-full">
                    {/* Wrapper for Input and Dropdown Button */}
                    <Input
                      value={row.nama_barang}
                      name="nama_barang"
                      onChange={(e) => handleFieldChange(e, index)}
                      placeholder="Nama Barang"
                      className="flex-1 border-none px-2 pt-2 outline-none"
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
                                  : allSuggestions, // Toggle suggestions
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
                        <ul className="absolute z-[200] mt-1 max-h-[250px] w-full overflow-y-auto rounded-2xl border border-gray-300 bg-white">
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

                <TableCell className="min-w-[150px] lg:min-w-fit">
                  <Input
                    value={row.quantity}
                    name="quantity"
                    onChange={(e) => handleFieldChange(e, index)}
                    placeholder="Quantity"
                    className="pt-2"
                  />
                </TableCell>


                <TableCell className="min-w-[150px] lg:min-w-fit">
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

        <div className="mt-4 flex justify-end">
          <Button color="primary" onClick={submitAcc}>
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminMainContent;
