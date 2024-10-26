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

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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

    if (aksi === "update") {
      // Remove item akse
      localStorage.removeItem("aksi");

      Swal.fire({
        title: "Apakah Kamu Yakin ?",
        text: "Apakah kamu yakin ingin mengubah purchase order ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Terima!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            if (data && data.data && data.data.data) {


              const res = await axios.post(`${apiUrl}/purchase-order/edit/posting-edit-admin`, data.data.data);
              console.log(res);
              if (res.data.status === true) {
                Swal.fire({
                  title: "Success",
                  text: "Purchase Order berhasil diubah",
                  icon: "success",
                }).then((result) => {
                  if (result.isConfirmed) {
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
    } else {
      Swal.fire({
        title: "Apakah Kamu Yakin ?",
        text: "Apakah kamu yakin ingin Membuat purchase order ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Terima!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            if (data && data.data && data.data.data) {

              
                const res = await axios.post(`${apiUrl}/purchase-order/posting`, data.data.data);
                if (res.data.status === true) {
                  Swal.fire({
                    title: "Success",
                    text: "PURCHASE ORDER BERHASIL DIBUAT",
                    icon: "success",
                  }).then((result) => {
                    if (result.isConfirmed) {
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
    }




  };

  const cancelData = async () => {
    router.push("/purchase-order");
  };

  if (!data || !data.data) {
    return <div>Loading...</div>;
  }

  // Destructure the inner data object
  const {
    nama_suplier, nomor_po, tanggal, catatan_po, prepared_by, prepared_jabatan,
    approved_by, approved_jabatan, sub_total, pajak, total, item, nomor_si
  } = data.data.data || {};

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        <TopSectionLeftSide />
      </ContentTopSectionLayout>
      <Divider />
      <div className="flex justify-between">
        <table className="w-full">
          <tbody>
            <td>
              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Nama Supplier:</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{nama_suplier}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Nomor Purchase Order:</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{nomor_po}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Nomor Surat Jalan:</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{nomor_si}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Tanggal:</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{tanggal}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Catatan Purchase Order:</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{catatan_po}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Prepared By:</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{prepared_by}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Prepared Jabatan:</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{prepared_jabatan}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Approved By:</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{approved_by}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Approved Jabatan:</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{approved_jabatan}</h1>
                </td>
              </tr>
            </td>
          </tbody>
        </table>
      </div>

      <Divider />




      {/* Bagian Table  */}

      <div className="flex justify-start my-1">
        <h1 className="font-semibold lg:text-[1.85vh]">List Harga Barang</h1>
      </div>

      {/* Bagian Table */}
      <div className="flex justify-between items-center">
        <Table removeWrapper>
          <TableHeader>
            <TableColumn className="bg-[#0C295F] text-white text-center">NO</TableColumn>
            <TableColumn className="bg-[#0C295F] text-white text-center">KODE</TableColumn>
            <TableColumn className="bg-[#0C295F] text-white text-center">NAMA BARANG</TableColumn>
            <TableColumn className="bg-[#0C295F] text-white text-center">VARIABLE</TableColumn>
            <TableColumn className="bg-[#0C295F] text-white text-center">QUANTITY</TableColumn>
            <TableColumn className="bg-[#0C295F] text-white text-center">HARGA SATUAN</TableColumn>
            <TableColumn className="bg-[#0C295F] text-white text-center">GUDANG</TableColumn>
            <TableColumn className="bg-[#0C295F] text-white text-center">AMOUNT</TableColumn>
          </TableHeader>
          <TableBody>
            {item?.map((item: { name: string; kode: string; quantity: number; price: string; gudang: string; amount: string; variable: string }, index: number) => (
              <TableRow key={index} className="">
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">{item.kode}</TableCell>
                <TableCell className="text-center">{item.name}</TableCell>
                <TableCell className="text-center">{item.variable}</TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell className="text-center">{item.price}</TableCell>
                <TableCell className="text-center">{item.gudang}</TableCell>
                <TableCell className="text-center">{item.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="py-4 grid w-[25%] grid-cols-2 self-end text-end text-sm font-bold">


        <p>Sub Total  : </p>
        <p>{sub_total}</p>
        <p>PPN 11%  : </p>
        <p>{pajak}</p>
        <p>Total : </p>
        <p>{total}</p>
      </div>




      <div className="flex justify-end gap-4">
        <Button onClick={cancelData} className="min-w-36 bg-red-600 text-white">
          Batalkan
        </Button>
        <Button onClick={submitData} className="min-w-36 bg-green-500 text-white">
          Konfirmasi
        </Button>
      </div>
    </div>
  );
};

export default MainContent;
