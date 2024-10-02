"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import TopSectionLeftSide from "../../TopSectionLeftSide";

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
  nama_rs: string;
  alamat: string;
  status: string;
  divisi: string;
  invoice_number: string;
  nomor_surat_jalan?: string;
  po_number: string;
  due_date: string;
  doctor_name: string;
  patient_name: string;
  tanggal_tindakan: string;
  rm: string;
  number_si: string;
  sub_total: string;
  pajak: string;
  total: string;
  reason: string;
  tanggal: string;
  item_detail_pi: ItemDetailPI[];
};

const AdminMainContent = () => {
  const [responseData, setResponseData] = useState<ProformaInvoice>({
    id: 0,
    customer_id: 0,
    nama_rs: "",
    alamat: "",
    status: "",
    divisi: "",
    invoice_number: "",
    nomor_surat_jalan: "",
    po_number: "",
    due_date: "",
    doctor_name: "",
    patient_name: "",
    tanggal_tindakan: "",
    rm: "",
    number_si: "",
    sub_total: "",
    pajak: "",
    total: "",
    reason: "",
    tanggal: "",
    item_detail_pi: [],
  });
  const [isRejected, setIsRejected] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const divisi = searchParams.get("divisi");

  useEffect(() => {
    if (!id) {
      console.error("ID is missing");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/proforma-invoice/detailPI",
          {
            id,
            divisi,
          },
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
          await axios.post(
            "http://localhost:8080/api/proforma-invoice/editPI-admin",
            responseData,
          );
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
    setResponseData((prevData) => ({
      ...prevData,
      status: "Diterima",
      reason: "",
    }));
    setShouldSubmit(true);
  };

  const submitReject = () => {
    setResponseData((prevData) => ({
      ...prevData,
      status: "Ditolak",
    }));
    setShouldSubmit(true);
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
        {/* Check profile customer and searchbar */}
        <TopSectionLeftSide />
      </ContentTopSectionLayout>
      <Divider />
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1>Nomor Invoice: {responseData.invoice_number}</h1>
          <h1>Nomor Surat Jalan: {responseData.po_number}</h1>
          <h1>Tanggal: {responseData.tanggal}</h1>
          <h1>Jatuh Tempo: {responseData.due_date}</h1>
          <h1>Nomor Surat Jalan: {responseData.number_si}</h1>
        </div>
        <div className="flex flex-col">
          <h1>Nama Rumah Sakit: {responseData.nama_rs}</h1>
          <h1>Alamat Rumah Sakit: {responseData.alamat}</h1>
        </div>
      </div>
      <Table removeWrapper aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>NO</TableColumn>
          <TableColumn>KAT.</TableColumn>
          <TableColumn>NAMA BARANG</TableColumn>
          <TableColumn>QTY</TableColumn>
          <TableColumn>H. SATUAN</TableColumn>
          <TableColumn>DISC</TableColumn>
          <TableColumn>SUB TOTAL</TableColumn>
        </TableHeader>
        <TableBody>
          {/* Map over dataItem to render each row */}
          {responseData.item_detail_pi.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.kat}</TableCell>
              <TableCell>{item.nama_barang}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.harga_satuan}</TableCell>
              <TableCell>{item.discount}</TableCell>
              <TableCell>{item.sub_total_item}</TableCell>
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
        <div className="rounded-md p-2 text-white">
          <Input
            label="Alasan Penolakan"
            value={responseData.reason ?? ""}
            onChange={handleReasonChange}
          />
          <div className="mt-4 flex gap-3">
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
