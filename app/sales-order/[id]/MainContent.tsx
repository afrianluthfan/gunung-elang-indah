"use client";

import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import TopSectionLeftSide from "./TopSectionLeftSide";
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
  const data = useAppSelector((state) => state.detailSOReducer.value);

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        <TopSectionLeftSide />
      </ContentTopSectionLayout>
      <Divider />
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1>Nomor Invoice: {data.invoice_number}</h1>
          <h1>Nomor Surat Jalan: {data.nomor_surat_jalan}</h1>
          <h1>Tanggal: {data.tanggal}</h1>
          <h1>Jatuh Tempo: {data.due_date}</h1>
          <h1>Nomor SI: {data.number_si}</h1>
        </div>
        <div className="flex flex-col">
          <h1>Nama Rumah Sakit: {data.nama_customer}</h1>
          <h1>Divis: {data.divisi}</h1>
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
          {data.item_detail_pi.map((item_detail_pi, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item_detail_pi.kat}</TableCell>
              <TableCell>{item_detail_pi.nama_barang}</TableCell>
              <TableCell>{item_detail_pi.quantity}</TableCell>
              <TableCell>{item_detail_pi.harga_satuan}</TableCell>
              <TableCell>{item_detail_pi.discount}</TableCell>
              <TableCell>{item_detail_pi.sub_total_item}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="grid w-[25%] grid-cols-2 self-end text-end text-sm font-bold">
        <p>Sub Total: </p>
        <p>{data.RP_sub_total}</p>
        <p>PPN 11%: </p>
        <p>{data.RP_pajak_ppn}</p>
        <p>Total: </p>
        <p>{data.RP_total}</p>
      </div>
    </div>
  );
};

export default MainContent;
