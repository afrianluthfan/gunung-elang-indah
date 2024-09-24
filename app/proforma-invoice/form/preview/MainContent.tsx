"use client";

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
import { useAppSelector } from "@/redux/store";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { resetItemPI } from "@/redux/features/itemPI-slice";
import { clearSalesPIInquiry } from "@/redux/features/salesPIInquiry-slice";
import { resetListItemPI } from "@/redux/features/listItemPI-slice";
import { useRouter } from "next/navigation";

type Hospital = {
  id: number;
  name: string;
  address_company: string;
};

const MainContent = () => {
  const router = useRouter();
  const [rsData, setRsData] = useState<Hospital[]>([]);
  const responseData = useAppSelector((state) => state.salesPIInquiry.value);

  useEffect(() => {
    const fetchRsData = async () => {
      try {
        const response = await axios.post(
          "http://209.182.237.155:8080/api/proforma-invoice/rs-list",
          "",
        );
        setRsData(response.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchRsData();
  }, []);

  const dispatch = useDispatch();

  const submitData = async () => {
    const selectedHospital = rsData.find(
      (hospital) => hospital.name === responseData.rumah_sakit,
    );

    const idRumahSakit = selectedHospital ? selectedHospital.id.toString() : "";

    const requestBody = {
      role_name: "SALES",
      id_divisi: responseData.id_divisi,
      id_rumah_sakit: idRumahSakit,
      rumah_sakit: responseData.rumah_sakit,
      alamat: responseData.alamat,
      nomor_invoice: responseData.nomor_invoice,
      nomor_po: responseData.nomor_po,
      nomor_si: responseData.nomor_si,
      tanggal: responseData.tanggal,
      jatuh_tempo: responseData.tanggal,
      sub_total: responseData.sub_total,
      pajak_ppn: responseData.pajak_ppn,
      total: responseData.total,
      RP_sub_total: responseData.RP_sub_total,
      RP_pajak_ppn: responseData.RP_pajak_ppn,
      RP_total: responseData.RP_total,
      item: responseData.item.map((item) => ({
        kat: item.kat,
        nama_barang: item.nama_barang,
        quantity: item.quantity,
        harga_satuan: item.harga_satuan,
        discount: item.discount.toString(),
      })),
    };

    try {
      await axios.post(
        "http://209.182.237.155:8080/api/proforma-invoice/posting",
        requestBody,
      );
      dispatch(resetItemPI());
      dispatch(resetListItemPI());
      dispatch(clearSalesPIInquiry());
      router.push("/proforma-invoice");
    } catch (error) {
      console.error("Error inquiring data", error);
      throw error;
    }
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
          <h1>Nomor Invoice: {responseData.nomor_invoice}</h1>
          <h1>Nomor Surat Jalan: {responseData.nomor_surat_jalan}</h1>
          <h1>Tanggal: {responseData.tanggal}</h1>
          <h1>Jatuh Tempo: {responseData.jatuh_tempo}</h1>
          <h1>Nomor Surat Jalan: {responseData.nomor_si}</h1>
        </div>
        <div className="flex flex-col">
          <h1>Nama Rumah Sakit: {responseData.rumah_sakit}</h1>
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
          {responseData.item.map((item, index) => (
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
        <p>{responseData.RP_sub_total}</p>
        <p>PPN 11%: </p>
        <p>{responseData.RP_pajak_ppn}</p>
        <p>Total: </p>
        <p>{responseData.RP_total}</p>
      </div>

      <div className="flex justify-end">
        <Button onClick={submitData} color="primary" className="min-w-36">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default MainContent;
