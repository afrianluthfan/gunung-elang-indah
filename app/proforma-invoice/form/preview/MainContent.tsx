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
import { resetItemPI, setItemPI } from "@/redux/features/itemPI-slice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

const MainContent = () => {
  const data = useAppSelector((state) => state.itemPIReducer.value);
  const dataItem = useAppSelector((state) => state.listItemPIReducer.value);

  const dispatch = useDispatch();
  const [divisiList, setDivisiList] = useState<{ id: number; name: string }[]>(
    [],
  );

  useEffect(() => {
    const fetchDivisiList = async () => {
      try {
        const responseDivisi = await axios.post(
          "http://localhost:8080/api/proforma-invoice/divisi-list",
          "",
        );
        setDivisiList(responseDivisi.data.data);
      } catch (error) {
        console.error("Gagal fetching list divisi!");
      }
    };
    fetchDivisiList();
  }, []);

  const submitData = async () => {
    const requestBody = {
      id_divisi: findIdByDivisi(data.divisi.toUpperCase()), // Set id_divisi based on divisi value
      rumah_sakit: data.namaRumahSakit,
      alamat: data.alamatRumahSakit,
      jatuh_tempo: data.jatuhTempo,
      nama_dokter: data.namaDokter,
      nama_pasien: data.namaPasien, // Fill this as per your application logic
      rm: data.rm,
      id_rumah_sakit: data.idRS, // Fill this as per your application logic
      tanggal_tindakan: data.tanggal,
      item: dataItem.map((item) => ({
        kat: item.kat,
        nama_barang: item.namaBarang,
        quantity: item.qty,
        harga_satuan: item.hSatuan,
        discount: item.disc,
      })),
    };
    console.log("requestBody: ", requestBody);
    console.log("data.divisi: ", data.divisi);
    console.log(divisiList);

    const response = await axios.post(
      "http://localhost:8080/api/proforma-invoice/inquiry",
      requestBody,
    );

    // Optionally, reset the form or take other actions upon successful submission
    dispatch(resetItemPI()); // Clear Redux state after submission if needed
  };

  const findIdByDivisi = (divisi: string) => {
    const selectedDivisi = divisiList.find((item) => item.name == divisi);
    return selectedDivisi ? selectedDivisi.id : null;
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
        <Button onClick={submitData} color="primary" className="min-w-36">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default MainContent;
