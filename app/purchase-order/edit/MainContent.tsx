"use client";

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
} from "@nextui-org/react";
import TopSectionLeftSide from "../TopSectionLeftSide";
import Swal from "sweetalert2";

type ItemDetail = {
  id: number;
  po_id: number;
  name: string;
  quantity: string;
  price: string;
  discount: string;
  amount: string;
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
};

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
  });

  const [isRejected, setIsRejected] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);

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
          "http://localhost:8080/api/purchase-order/detail",
          {
            id: id,
          }
        );
        setResponseData(response.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (shouldSubmit) {
      const submitData = async () => {
        try {
          await axios.post(
            "http://localhost:8080/api/purchase-order/edit/finance",
            responseData
          );
          Swal.fire({
            title: "Success!",
            text: "Purchase order berhasil di "+ responseData.status +".",
            icon: "success",
            confirmButtonText: "OK"
          });
          router.push("/purchase-order");
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

  const submitAcc = () => {
    Swal.fire({
      title: 'Apakah Kamu Yakin ?',
      text: "Apakah kamu yakin ingin menerima purchase order ini!",
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
      title: 'Apakah Kamu Yakin ?',
      text: "Apakah kamu yakin ingin menolak purchase order ini!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, accept it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setResponseData((prevData) => ({
          ...prevData,
          status: "DITOLAK",
        }));
        setShouldSubmit(true);
      }
    });
  };

  const rejectData = () => {
    setIsRejected(true);
  };

  const cancelReject = () => {
    setIsRejected(false);
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newReason = e.target.value;
    setResponseData((prevData) => ({
      ...prevData,
      reason: newReason,
    }));
  };

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        <TopSectionLeftSide />
      </ContentTopSectionLayout>
      <Divider />
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1>Nomor PO: {responseData.nomor_po}</h1>
          <h1>Tanggal: {responseData.tanggal}</h1>
          <h1>Supplier: {responseData.nama_suplier}</h1>
          <h1>Prepared by: {responseData.prepared_by} ({responseData.prepared_jabatan})</h1>
          <h1>Approved by: {responseData.approved_by} ({responseData.approved_jabatan})</h1>
        </div>
        <div className="flex flex-col">
          <h1>Sub Total: {responseData.sub_total}</h1>
          <h1>Pajak: {responseData.pajak}</h1>
          <h1>Total: {responseData.total}</h1>
        </div>
      </div>
      <Table removeWrapper aria-label="Purchase Order Details">
        <TableHeader>
          <TableColumn>NO</TableColumn>
          <TableColumn>NAMA BARANG</TableColumn>
          <TableColumn>QTY</TableColumn>
          <TableColumn>HARGA SATUAN</TableColumn>
          <TableColumn>DISC</TableColumn>
          <TableColumn>SUB TOTAL</TableColumn>
        </TableHeader>
        <TableBody>
          {responseData.item.map((item, index) => (
            <TableRow key={item.id}>
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
        <p>{responseData.sub_total}</p>
        <p>PPN 11%: </p>
        <p>{responseData.pajak}</p>
        <p>Total: </p>
        <p>{responseData.total}</p>
      </div>

      {!isRejected && (
        <div className="flex justify-end gap-3">
          <Button onClick={rejectData} color="danger" className="min-w-36">
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
      {isRejected && (
        <div className="rounded-md  p-2 text-white">
          <Input
            label="Alasan Penolakan"
            value={responseData.reason ?? ""}
            onChange={handleReasonChange}
          />
          <div className="mt-4 flex justify-end gap-3">
            <Button
              onClick={submitReject}
              color="danger"
              className="min-w-36"
              disabled={
                !responseData.reason || responseData.reason.length === 0
              }
            >
              Setujui Penolakan
            </Button>
            <Button onClick={cancelReject} className="min-w-36">
              Batal Penolakan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMainContent;
