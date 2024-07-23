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
  }, []);

  const submitData = async () => {
    Swal.fire({
      title: "Apakah Kamu Yakin ?",
      text: "Apakah kamu yakin ingin menerima purchase order ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, accept it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          if (data && data.data && data.data.data) {
            axios.post("http://localhost:8080/api/purchase-order/posting", data.data.data);
             // Replace with your desired route
          } else {
            console.error("Data is not available");
          }
        } catch (error) {
          console.error("Error inquiring data", error);
          throw error;
        }
        router.push("/purchase-order");
      }
    });


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
    approved_by, approved_jabatan, sub_total, pajak, total, item
  } = data.data.data || {};

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        <TopSectionLeftSide />
      </ContentTopSectionLayout>
      <Divider />
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1>Nama Supplier: {nama_suplier}</h1>
          <h1>Nomor Purchase Order: {nomor_po}</h1>
          <h1>Tanggal: {tanggal}</h1>
          <h1>Catatan Purchase Order: {catatan_po}</h1>
        </div>
        <div className="flex flex-col">
          <h1>Prepared By: {prepared_by}</h1>
          <h1>Prepared Jabatan: {prepared_jabatan}</h1>
          <h1>Approved By: {approved_by}</h1>
          <h1>Approved Jabatan: {approved_jabatan}</h1>
        </div>
      </div>
      <Divider />
      <Table removeWrapper aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>NO</TableColumn>
          <TableColumn>NAMA BARANG</TableColumn>
          <TableColumn>QUANTITY</TableColumn>
          <TableColumn>HARGA SATUAN</TableColumn>
          <TableColumn>DISCOUNT</TableColumn>
          <TableColumn>AMOUNT</TableColumn>
        </TableHeader>
        <TableBody>
          {item?.map((item: { name: string; quantity: number; price: number; discount: number; amount: number }, index: number) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{item.discount}</TableCell>
              <TableCell>{item.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="grid w-[25%] grid-cols-2 self-end text-end text-sm font-bold">
        <p>Sub Total: </p>
        <p>{sub_total}</p>
        <p>PPN 11%: </p>
        <p>{pajak}</p>
        <p>Total: </p>
        <p>{total}</p>
      </div>

      <div className="flex justify-end gap-4">
        <Button onClick={cancelData} color="danger" className="min-w-36">
          Cancel
        </Button>
        <Button onClick={submitData} color="primary" className="min-w-36">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default MainContent;
