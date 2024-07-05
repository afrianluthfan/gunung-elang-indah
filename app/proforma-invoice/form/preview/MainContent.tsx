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
import { useEffect } from "react";

const MainContent = () => {
  const data = useAppSelector((state) => state.itemPIReducer.value);
  const dataItem = useAppSelector((state) => state.listItemPIReducer.value);

  const tesButton = async () => {
    try {
      const testdata = await axios.post(
        "http://localhost:8080/api/customer-profilling/get-tax-code",
        "",
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Example of performing side effects on component mount
    tesButton();
  }, []);

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        {/* Check profile customer and searchbar */}
        <TopSectionLeftSide />
      </ContentTopSectionLayout>
      <Divider />
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1>Nomor Invoice: {data.nomorInvoice}</h1>
          <h1>Nomor PI: {data.nomorPI}</h1>
          <h1>Tanggal: {data.tanggal}</h1>
          <h1>Jatuh Tempo: {data.jatuhTempo}</h1>
          <h1>Nomor SI: {data.nomorSuratJalan}</h1>
        </div>
        <div className="flex flex-col">
          <h1>Nama Rumah Sakit: {data.namaRumahSakit}</h1>
          <h1>Alamat Rumah Sakit: {data.alamatRumahSakit}</h1>
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
          {dataItem.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.kat}</TableCell>
              <TableCell>{item.namaBarang}</TableCell>
              <TableCell>{item.qty}</TableCell>
              <TableCell>{item.hSatuan}</TableCell>
              <TableCell>{item.disc}</TableCell>
              <TableCell>{item.subTotal}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end">
        <Button onClick={tesButton} color="primary" className="min-w-36">
          tes
        </Button>
      </div>
    </div>
  );
};

export default MainContent;
