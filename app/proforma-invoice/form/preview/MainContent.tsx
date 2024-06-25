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

const MainContent = () => {
  const data = useAppSelector((state) => state.itemPIReducer.value);
  const dataItem = useAppSelector((state) => state.listItemPIReducer.value);
  console.log(data);

  const columns = [
    {
      key: "no",
      label: "NO.",
    },
    {
      key: "kat",
      label: "KAT.",
    },
    {
      key: "namaBarang",
      label: "NAMA BARANG",
    },
    {
      key: "hSatuan",
      label: "HARGA SATUAN",
    },
    {
      key: "qty",
      label: "QTY",
    },
    {
      key: "disc",
      label: "DISC",
    },
    {
      key: "subTotal",
      label: "SUB TOTAL",
    },
  ];

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        {/* cek profile customer and searchbar */}
        <TopSectionLeftSide />
      </ContentTopSectionLayout>
      <Divider />
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1>Nomor Invoice: {data.nomorInvoice}</h1>
          <h1>Nomor PI: {data.nomorPI}</h1>
          <h1>Tanggal: {data.tanggal}</h1>
          <h1>Jatuh Tempo: {data.jatuhTempo}</h1>
          <h1>Nomor SI: {data.nomorSI}</h1>
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
          <TableRow key="1">
            <TableCell>1</TableCell>
            <TableCell>{dataItem.kat}</TableCell>
            <TableCell>{dataItem.namaBarang}</TableCell>
            <TableCell>{dataItem.qty}</TableCell>
            <TableCell>{dataItem.hSatuan}</TableCell>
            <TableCell>{dataItem.disc}</TableCell>
            <TableCell>{dataItem.subTotal}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="flex justify-end">
        <Button color="primary" className="min-w-36">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default MainContent;
