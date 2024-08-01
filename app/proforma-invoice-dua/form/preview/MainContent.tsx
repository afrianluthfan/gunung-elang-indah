"use client";

import React, { useEffect, useState } from "react";
import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import TopSectionLeftSide from "../TopSectionLeftSide";
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
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";

const MainContent = () => {
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Retrieve data from localStorage
    const storedData = localStorage.getItem("purchaseOrder");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
    // localStorage.removeItem("purchaseOrder");
  }, []);

  const submitData = async () => {
    const aksi = localStorage.getItem("aksi");
    Swal.fire({
      title: "Apakah Kamu Yakin ?",
      text: "Apakah kamu yakin ingin mengubah Proforma Invoice ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Terima!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (data && data.data && data.data.data) {

            if (aksi === "update") {
              const res = await axios.post("http://209.182.237.155:8080/api/proforma-invoice/editPI-posting", data.data.data);
              console.log(res);
              if (res.data.status === true) {
                Swal.fire({
                  title: "Success",
                  text: "Proforma Invoice berhasil diubah",
                  icon: "success",
                }).then((result) => {
                  if (result.isConfirmed) {
                    localStorage.removeItem("purchaseOrder");
                    localStorage.removeItem("aksi");
                    router.push("/proforma-invoice-dua");
                  }
                });
              } else {
                Swal.fire({
                  title: "Failed",
                  text: "Purchase Order gagal diubah",
                  icon: "error",
                });
              }
            } else {
              const res = await axios.post("http://209.182.237.155:8080/api/proforma-invoice/posting", data.data.data);
              if (res.data.status === true) {
                Swal.fire({
                  title: "Success",
                  text: "Purchase Order berhasil diubah",
                  icon: "success",
                }).then((result) => {
                  if (result.isConfirmed) {
                    localStorage.removeItem("purchaseOrder");
                    localStorage.removeItem("aksi");
                    router.push("/purchase-order");
                  }
                });
              } else {
                Swal.fire({
                  title: "Failed",
                  text: "Purchase Order gagal diubah",
                  icon: "error",
                });
              }
            }
            // Replace with your desired route
          } else {
            console.error("Data is not available");
          }
        } catch (error) {
          console.error("Error inquiring data", error);
          throw error;
        }


        localStorage.removeItem("purchaseOrder");
        localStorage.removeItem("aksi");

      }
    });


  };

  const cancelData = async () => {
    router.push("/proforma-invoice-dua");
  };

  if (!data || !data.data) {
    return <div>Loading...</div>;
  }

  // Destructure the inner data object
  const {
    nama_suplier, nomor_po, tanggal_tindakan, catatan_po, prepared_by, prepared_jabatan,
    approved_by, approved_jabatan, sub_total, pajak, total, item, alamat, item_detail_pi,

    RP_sub_total,
    RP_pajak_ppn,
    RP_total,
    id_divisi,
    divisi,

    nama_pasien,
    nama_dokter,

    status,

    rumah_sakit, jatuh_tempo, nomor_invoice, nomor_si, tanggal, 
    
    invoice_number, due_date, number_si, doctor_name, patient_name, nama_customer, alamat_customer
  } = data.data.data || {};

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        <TopSectionLeftSide />
      </ContentTopSectionLayout>
      <Divider />



      {/* KONDISI ORTOPEDI */}
      {id_divisi === "Ortopedi" && (
        <>
          {/* Konten untuk divisi Ortopedi */}
          <div className="flex justify-between">
            <table className="w-full">
              <tbody>
                <td>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Nama Perusahaan</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{rumah_sakit}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Alamat Perusahaan</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{alamat}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Tanggal PI</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{tanggal}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Tanggal Tindakan</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{tanggal_tindakan}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Jatuh Tempo</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{jatuh_tempo}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Nomor Invoice</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{nomor_invoice}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Nomor SI</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{nomor_si}</h1>
                    </td>
                  </tr>

                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Nama Dokter</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{nama_dokter}</h1>
                    </td>
                  </tr>

                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Nama Pasien</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{nama_pasien}</h1>
                    </td>
                  </tr>
                </td>
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* KONDISI RADIOLOGI */}
      {id_divisi === "Radiologi" && (
        <>
          {/* Konten untuk divisi Ortopedi */}
          <div className="flex justify-between">
            <table className="w-full">
              <tbody>
                <td>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Nama Perusahaan</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{rumah_sakit}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Alamat Perusahaan</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{alamat}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Tanggal PI</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{tanggal}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Jatuh Tempo</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{jatuh_tempo}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Nomor Invoice</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{nomor_invoice}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Nomor SI</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{nomor_si}</h1>
                    </td>
                  </tr>
                </td>
              </tbody>
            </table>
          </div>
        </>
      )}

      {divisi === "Ortopedi" && (
        <>
          {/* Konten untuk divisi Ortopedi */}
          <div className="flex justify-between">
            <table className="w-full">
              <tbody>
                <td>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Nama Perusahaan</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{nama_customer}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Alamat Perusahaan</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{alamat_customer}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Tanggal PI</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{tanggal}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Tanggal Tindakan</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{tanggal_tindakan}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Jatuh Tempo</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{due_date}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Nomor Invoice</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{invoice_number}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Nomor SI</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{number_si}</h1>
                    </td>
                  </tr>

                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Nama Dokter</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{doctor_name}</h1>
                    </td>
                  </tr>

                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Nama Pasien</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{patient_name}</h1>
                    </td>
                  </tr>
                </td>
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* KONDISI RADIOLOGI */}
      {divisi === "Radiologi" && (
        <>
          {/* Konten untuk divisi Ortopedi */}
          <div className="flex justify-between">
            <table className="w-full">
              <tbody>
                <td>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Nama Perusahaan</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{nama_customer}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Alamat Perusahaan</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{alamat_customer}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Tanggal PI</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{tanggal}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Jatuh Tempo</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{due_date}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Nomor Invoice</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{invoice_number}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className=" text-left">
                      <h1 className=" font-medium">Nomor SI</h1>
                    </td>
                    <td className="w-10 text-center">:</td>
                    <td className="">
                      <h1>{number_si}</h1>
                    </td>
                  </tr>
                </td>
              </tbody>
            </table>
          </div>
        </>
      )}

      <Divider />




      {/* Bagian Table  */}

      <div className="flex justify-start my-1">
        <h1 className="font-semibold lg:text-[1.85vh]">List Harga Barang</h1>
      </div>

      {/* Bagian Table */}
      <div className="flex justify-between items-center">
        <Table removeWrapper>
          <TableHeader>
            <TableColumn className="bg-blue-900 text-white text-center">NO</TableColumn>
            <TableColumn className="bg-blue-900 text-white text-center">NAMA BARANG</TableColumn>
            <TableColumn className="bg-blue-900 text-white text-center">QUANTITY</TableColumn>
            <TableColumn className="bg-blue-900 text-white text-center">HARGA SATUAN</TableColumn>
            <TableColumn className="bg-blue-900 text-white text-center">DISCOUNT</TableColumn>
            <TableColumn className="bg-blue-900 text-white text-center">AMOUNT</TableColumn>
          </TableHeader>
          <TableBody>
            {item?.map((item: { nama_barang: string; quantity: string; harga_satuan: string; discount: string; RP_sub_total_item: string }, index: number) => (
              <TableRow key={index} className="">
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">{item.nama_barang}</TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell className="text-center">{item.harga_satuan}</TableCell>
                <TableCell className="text-center">{item.discount}</TableCell>
                <TableCell className="text-center">{item.RP_sub_total_item}</TableCell>
              </TableRow>
            ))}
            {item_detail_pi?.map((item_detail_pi: { nama_barang: string; quantity: string; harga_satuan: string; discount: string; rp_sub_total_item: string }, index: number) => (
              <TableRow key={index} className="">
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">{item_detail_pi.nama_barang}</TableCell>
                <TableCell className="text-center">{item_detail_pi.quantity}</TableCell>
                <TableCell className="text-center">{item_detail_pi.harga_satuan}</TableCell>
                <TableCell className="text-center">{item_detail_pi.discount}</TableCell>
                <TableCell className="text-center">{item_detail_pi.rp_sub_total_item}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="py-4 grid w-[35%] grid-cols-2 self-end text-end text-sm font-bold">


        <p>Sub Total  : </p>
        <p>{RP_sub_total}</p>
        <p>PPN 11%  : </p>
        <p>{RP_pajak_ppn}</p>
        <p>Total : </p>
        <p>{RP_total}</p>
      </div>


      <div className="flex justify-end gap-4">
        <Button onClick={cancelData}  className="min-w-36 bg-red-600 text-white">
          Batalkan
        </Button>
        <Button onClick={submitData}  className="min-w-36 bg-green-500 text-white">
          Konfirmasi
        </Button>
      </div>


    </div>
  );
};

export default MainContent;
