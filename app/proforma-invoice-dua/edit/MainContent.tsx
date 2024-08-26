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
  id: number;
  kat: string;
  nama_barang: string;
  quantity: string;
  harga_satuan: string;
  discount: string;
  sub_total_item: string;
};

type ProformaInvoice = {
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
    tanggal_tindakan: "",
    nama_customer: "",
    alamat_customer: "",
    item_detail_pi: [],
  });

  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const divisi = searchParams.get("divisi");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
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
          "http://localhost:8080/api/proforma-invoice/detailPI",
          { id: id, divisi: divisi }
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

          await axios.post(
            "http://localhost:8080/api/proforma-invoice/editPI-admin",
            responseData
          );
          Swal.fire({
            title: "Success!",
            text: "Proforma Invoice berhasil di " + responseData.status + ".",
            icon: "success",
            confirmButtonText: "OK"
          });
          router.push("/proforma-invoice-dua");
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
      title: 'Apakah Kamu Yakin ?',
      text: "Apakah kamu yakin ingin menerima proforma invoice ini!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, accept it!'
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
      title: 'Alasan Penolakan',
      input: 'textarea',
      inputLabel: 'Masukkan alasan penolakan',
      inputPlaceholder: 'Alasan penolakan...',
      inputAttributes: {
        'aria-label': 'Masukkan alasan penolakan'
      },
      showCancelButton: true,
      confirmButtonText: 'Kirim',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      inputValidator: (value) => {
        if (!value) {
          return 'Alasan penolakan tidak boleh kosong!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setResponseData((prevData) => ({
          ...prevData,
          status: "DITOLAK",
          reason: result.value
        }));
        setShouldSubmit(true);
      }
    });
  };

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <h1 className="font-semibold lg:text-[1.85vh]">Detail Proforma Invoice</h1>
      <Divider />

      {/* Jika divisi === Ortopedic */}
      {divisi === "Ortopedi" && (
        <div className="flex justify-between">
          <table className="">
            <tbody>
              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Perusahaan</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.nama_customer}</h1>
                </td>
              </tr>

              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Alamat Perusahaan</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.alamat_customer}</h1>
                </td>
              </tr>

              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Nomor Invoice</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.invoice_number}</h1>
                </td>
              </tr>

              <tr>
                <td className=" text-left">
                  <h1 className="font-medium">Number SI</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.number_si}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Jatuh Tempo</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.due_date}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className="font-medium">Nama Dokter</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.doctor_name}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className="font-medium">Nama Pasien</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.patient_name}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className="font-medium">Tanggal Tindakan</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.tanggal_tindakan}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className="font-medium">Divisi</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.divisi}</h1>
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
                <td className=" text-left">
                  <h1 className=" font-medium">Perusahaan</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.nama_customer}</h1>
                </td>
              </tr>

              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Alamat Perusahaan</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.alamat_customer}</h1>
                </td>
              </tr>

              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Nomor Invoice</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.invoice_number}</h1>
                </td>
              </tr>

              <tr>
                <td className=" text-left">
                  <h1 className="font-medium">Number SI</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.number_si}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Tanggal Jatuh Tempo</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.due_date}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className="font-medium">Divisi</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.divisi}</h1>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <Divider />

      <div className="flex justify-start my-1">
        <h1 className="font-semibold lg:text-[1.4vh]">List Barang</h1>
      </div>

      {/* Bagian Table */}
      <div className="flex justify-between items-center">
        <Table removeWrapper>
          <TableHeader>
            <TableColumn className="bg-blue-900 text-white text-center">NO</TableColumn>
            <TableColumn className="bg-blue-900 text-white text-center">KAT</TableColumn>
            <TableColumn className="bg-blue-900 text-white text-center">NAMA BARANG</TableColumn>
            <TableColumn className="bg-blue-900 text-white text-center">QTY</TableColumn>
            <TableColumn className="bg-blue-900 text-white text-center">HARGA SATUAN</TableColumn>
            <TableColumn className="bg-blue-900 text-white text-center">DISC</TableColumn>
            <TableColumn className="bg-blue-900 text-white text-center">SUB TOTAL</TableColumn>
          </TableHeader>
          <TableBody>
            {responseData.item_detail_pi.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">{item.kat}</TableCell>
                <TableCell className="text-center">{item.nama_barang}</TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell className="text-center">{item.harga_satuan}</TableCell>
                <TableCell className="text-center">{item.discount}</TableCell>
                <TableCell className="text-center">{item.sub_total_item}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Divider />

      <div className="grid w-[25%] grid-cols-2 gap-2 self-end text-sm font-bold">
        <p className="text-end">Sub Total : </p>
        <p className="text-start">{responseData.sub_total}</p>
        <p className="text-end">PPN 11% : </p>
        <p className="text-start">{responseData.pajak}</p>
        <p className="text-end">Total : </p>
        <p className="text-start">{responseData.total}</p>
      </div>

      {
        username === 'admin' && (
          responseData.status !== 'Diterima' && (
            <div className="flex justify-end gap-3">
              <Button onClick={submitReject} color="danger" className="min-w-36">
                Ditolak
              </Button>
              <Button onClick={submitAcc} color="success" className="min-w-36 text-white">
                Diterima
              </Button>
            </div>
          )
        )
      }
    </div>
  );
};

export default ProformaInvoiceDetail;
