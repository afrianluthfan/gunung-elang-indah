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

const MainContent = () => {
  const data = useAppSelector(
    (state) => state.salesPIInquirySliceReducer.value,
  );

  const dispatch = useDispatch();

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        {/* Check profile customer and searchbar */}
        <TopSectionLeftSide />
      </ContentTopSectionLayout>
      <Divider />
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1>Nomor Invoice: {data.nomor_invoice}</h1>
          <h1>Nomor PI: {data.nomor_invoice}</h1>
          <h1>Tanggal: {data.tanggal}</h1>
          <h1>Jatuh Tempo: {data.jatuh_tempo}</h1>
          <h1>Nomor SI: {data.nomor_si}</h1>
        </div>
        <div className="flex flex-col">
          <h1>Nama Rumah Sakit: {data.rumah_sakit}</h1>
          <h1>Alamat Rumah Sakit: {data.alamat}</h1>
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
          {data.item.map((item, index) => (
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

      <div className="flex justify-end">
        <Button color="primary" className="min-w-36">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default MainContent;
