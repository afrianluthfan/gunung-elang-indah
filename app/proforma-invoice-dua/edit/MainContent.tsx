import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

type ItemDetailPI = {
  gudang: string;
  variable: string;
  id: number;
  kat: string;
  nama_barang: string;
  quantity: string;
  harga_satuan: string;
  discount: string;
  sub_total_item: string;
};

type ProformaInvoice = {
  nama_pasien: string;
  nama_dokter: string;
  alamat: string;
  rumah_sakit: string;
  id: number;
  customer_id: number;
  status: string;
  divisi: string;
  invoice_number: string;
  due_date: string;
  number_si: string;
  sub_total: string;
  pajak: string;
  total: string;
  doctor_name: string;
  patient_name: string;
  tanggal_tindakan: string;
  nama_customer: string;
  alamat_customer: string;
  rm: string;
  item_detail_pi: ItemDetailPI[];
};

const ProformaInvoiceDetail = () => {
  const router = useRouter();
  const [responseData, setResponseData] = useState<ProformaInvoice>({
    id: 0,
    customer_id: 0,
    status: "",
    divisi: "",
    invoice_number: "",
    due_date: "",
    number_si: "",
    sub_total: "",
    pajak: "",
    total: "",
    doctor_name: "",
    patient_name: "",
    nama_dokter: "",
    nama_pasien: "",
    tanggal_tindakan: "",
    nama_customer: "",
    alamat_customer: "",
    rumah_sakit: "",
    alamat: "",
    rm: "",
    item_detail_pi: [],
  });

  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const divisi = searchParams.get("divisi");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const storedUsername = localStorage.getItem("statusAccount");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (!id || !divisi) {
      console.error("ID atau Divisi tidak ditemukan");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${apiUrl}/proforma-invoice/detailPI`,
          { id: id, divisi: divisi },
        );
        setResponseData(response.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [id, divisi]);

  useEffect(() => {
    if (shouldSubmit) {
      const submitData = async () => {
        try {
          if (responseData.status === "DITOLAK") {
            responseData.status = "Ditolak";
          }

          if (responseData.status === "DITERIMA") {
            responseData.status = "Diterima";
          }

          try {
            const response = await axios.post(
              `${apiUrl}/proforma-invoice/editPI-admin`,
              responseData,
            );

            // Jika berhasil, tampilkan pesan sukses
            Swal.fire({
              title: "Success!",
              text: "Proforma Invoice berhasil di " + responseData.status + ".",
              icon: "success",
              confirmButtonText: "OK",
            });

            // Redirect ke halaman lain
            router.push("/proforma-invoice-dua");
          } catch (error) {
            if (responseData.status === "DITOLAK") {
              responseData.status = "Diterima";
            }

            if (responseData.status === "DITERIMA") {
              responseData.status = "Ditolak";
            }

            if (responseData.status === "Ditolak") {
              responseData.status = "Diterima";
            }

            if (responseData.status === "Diterima") {
              responseData.status = "Ditolak";
            }

            // Tangkap error dari response dan tampilkan error message
            if (axios.isAxiosError(error) && error.response?.data) {
              const errorMessage =
                error.response.data.message || "Terjadi kesalahan.";

              Swal.fire({
                title: "Error!",
                html: errorMessage,
                icon: "error",
                confirmButtonText: "OK",
              });
            } else {
              // Jika tidak ada detail error dari server, tampilkan error umum
              Swal.fire({
                title: "Error!",
                text: "Terjadi kesalahan saat memproses permintaan.",
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          }
        } catch (error) {
          console.error("Error submitting data", error);
        } finally {
          setShouldSubmit(false);
        }
      };

      submitData();
    }
  }, [shouldSubmit, responseData]);

  const submitAcc = () => {
    Swal.fire({
      title: "Apakah Kamu Yakin ?",
      text: "Apakah kamu yakin ingin menerima proforma invoice ini ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, accept it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setResponseData((prevData) => ({
          ...prevData,
          status: "DITERIMA",
        }));
        setShouldSubmit(true);
      }
    });
  };

  const submitReject = () => {
    Swal.fire({
      title: "Alasan Penolakan",
      input: "textarea",
      inputLabel: "Masukkan alasan penolakan",
      inputPlaceholder: "Alasan penolakan...",
      inputAttributes: {
        "aria-label": "Masukkan alasan penolakan",
      },
      showCancelButton: true,
      confirmButtonText: "Kirim",
      cancelButtonText: "Batal",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      inputValidator: (value) => {
        if (!value) {
          return "Alasan penolakan tidak boleh kosong!";
        }
        return null;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setResponseData((prevData) => ({
          ...prevData,
          status: "DITOLAK",
          reason: result.value,
        }));
        setShouldSubmit(true);
      }
    });
  };

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <h1 className="font-semibold lg:text-[1.85vh]">
        Detail Proforma Invoice
      </h1>
      <Divider />

      {/* Jika divisi === Ortopedic */}
      {divisi === "Ortopedi" && (
        <div className="flex justify-between">
          <table className="">
            <tbody>
              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Perusahaan</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.rumah_sakit}</h1>
                </td>
              </tr>

              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Alamat Perusahaan</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.alamat}</h1>
                </td>
              </tr>

              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Nomor Invoice</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.invoice_number}</h1>
                </td>
              </tr>

              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Number SI</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.number_si}</h1>
                </td>
              </tr>
              {/* <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Jatuh Tempo</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.due_date}</h1>
                </td>
              </tr> */}
              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Nama Dokter</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.nama_dokter}</h1>
                </td>
              </tr>
              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Nama Pasien</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.nama_pasien}</h1>
                </td>
              </tr>
              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Tanggal Tindakan</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.tanggal_tindakan}</h1>
                </td>
              </tr>
              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Divisi</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.divisi}</h1>
                </td>
              </tr>

              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Rekam Medis</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.rm}</h1>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Jika divisi === Radiologi */}
      {divisi === "Radiologi" && (
        <div className="flex justify-between">
          <table className="">
            <tbody>
              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Perusahaan</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.rumah_sakit}</h1>
                </td>
              </tr>

              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Alamat Perusahaan</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.alamat}</h1>
                </td>
              </tr>

              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Nomor Invoice</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.invoice_number}</h1>
                </td>
              </tr>

              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Number SI</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.number_si}</h1>
                </td>
              </tr>

              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Divisi</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.divisi}</h1>
                </td>
              </tr>

              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Rekam Medis</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.rm}</h1>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <Divider />

      <div className="my-1 flex justify-start">
        <h1 className="font-semibold lg:text-[1.4vh]">List Barang</h1>
      </div>

      {/* Bagian Table */}
  
      {username === "SALES" ? (
        <div className="flex items-center justify-between overflow-x-scroll">
          <Table removeWrapper>
            <TableHeader>
              <TableColumn className="bg-[#0C295F] text-center text-white">
                NO
              </TableColumn>
              <TableColumn className="bg-[#0C295F] text-center text-white">
                KODE BARANG
              </TableColumn>
              <TableColumn className="bg-[#0C295F] text-center text-white">
                NAMA BARANG
              </TableColumn>
              <TableColumn className="bg-[#0C295F] text-center text-white">
                VARIABLE
              </TableColumn>
              <TableColumn className="bg-[#0C295F] text-center text-white">
                QTY
              </TableColumn>
              <TableColumn className="bg-[#0C295F] text-center text-white">
                GUDANG ASAL
              </TableColumn>
            </TableHeader>
            <TableBody>
              {responseData.item_detail_pi.map((item, index) => (

                <TableRow key={item.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">{item.kat}</TableCell>
                  <TableCell className="text-center">
                    {item.nama_barang}
                  </TableCell>
                  <TableCell className="text-center">{item.variable}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-center">{item.gudang}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex items-center justify-between overflow-x-scroll">
          <Table removeWrapper>
            <TableHeader>
              <TableColumn className="bg-[#0C295F] text-center text-white">
                NO
              </TableColumn>
              <TableColumn className="bg-[#0C295F] text-center text-white">
                KODE BARANG
              </TableColumn>
              <TableColumn className="bg-[#0C295F] text-center text-white">
                NAMA BARANG
              </TableColumn>
              <TableColumn className="bg-[#0C295F] text-center text-white">
                VARIABLE
              </TableColumn>
              <TableColumn className="bg-[#0C295F] text-center text-white">
                QTY
              </TableColumn>
              <TableColumn className="bg-[#0C295F] text-center text-white">
                HARGA SATUAN
              </TableColumn>
              <TableColumn className="bg-[#0C295F] text-center text-white">
                DISC
              </TableColumn>
              <TableColumn className="bg-[#0C295F] text-center text-white">
                GUDANG ASAL
              </TableColumn>
              <TableColumn className="bg-[#0C295F] text-center text-white">
                SUB TOTAL
              </TableColumn>
            </TableHeader>
            <TableBody>
              {responseData.item_detail_pi.map((item, index) => (

                <TableRow key={item.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">{item.kat}</TableCell>
                  <TableCell className="text-center">
                    {item.nama_barang}
                  </TableCell>
                  <TableCell className="text-center">{item.variable}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>

                  <TableCell className="text-center">
                    {item.harga_satuan}
                  </TableCell>
                  <TableCell className="text-center">{item.discount}</TableCell>
                  <TableCell className="text-center">{item.gudang}</TableCell>
                  <TableCell className="text-center">
                    {item.sub_total_item}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Divider />

      {username === "ADMIN" && (
        <div className="grid grid-cols-2 gap-2 self-end text-sm font-bold lg:w-[25%]">
          <p className="text-end">Sub Total : </p>
          <p className="text-start">{responseData.sub_total}</p>
          <p className="text-end">PPN 11% : </p>
          <p className="text-start">{responseData.pajak}</p>
          <p className="text-end">Total : </p>
          <p className="text-start">{responseData.total}</p>
        </div>
      )}



      {username === "ADMIN" && responseData.status !== "Diterima" && (
        <div className="flex justify-end gap-3">
          <Button onClick={submitReject} color="danger" className="min-w-36">
            Ditolak
          </Button>
          <Button
            onClick={submitAcc}
            color="success"
            className="min-w-36 text-white"
          >
            Diterima
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProformaInvoiceDetail;
