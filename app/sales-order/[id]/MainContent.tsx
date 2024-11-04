"use client";

import ContentTopSectionLayout from "../../../components/layouts/TopSectionLayout";
import { useAppSelector } from "../../../redux/store";
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

const MainContent = () => {
  const data = useAppSelector((state) => state.detailSO.value);

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        <TopSectionLeftSide />
      </ContentTopSectionLayout>
      <Divider />
      <div className="flex justify-between">


        <div className="flex justify-between">
          <table className="">
            <tbody>
              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Nama Supplier</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{data.nama_customer}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Nomor Purchase Order</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{data.invoice_number}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Nomor Surat Jalan</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{data.nomor_surat_jalan}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Tanggal</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{data.tanggal}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Prepared By</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{data.preperad_by}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Prepared Jabatan</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{data.preperad_jabatan}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Approved By</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{data.approved_by}</h1>
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Approved Jabatan</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{data.approve_jabatan}</h1>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-col">
        </div>
      </div>

      <Divider />

      <div className="flex flex-row justify-between">
        <h1 className="text-xl font-semibold lg:text-[1.85vh]">Detail Barang</h1>
        <button className="bg-green-600 text-white p-2 rounded-md">Simpan Data</button>
      </div>

      <Table removeWrapper aria-label="Example static collection table ">
        <TableHeader >
          <TableColumn className="bg-[#0C295F] text-white">NO</TableColumn>
          <TableColumn className="bg-[#0C295F] text-white">KAT.</TableColumn>
          <TableColumn className="bg-[#0C295F] text-white">NAMA BARANG</TableColumn>
          <TableColumn className="bg-[#0C295F] text-white">QTY</TableColumn>
          <TableColumn className="bg-[#0C295F] text-white">H. SATUAN</TableColumn>
          <TableColumn className="bg-[#0C295F] text-white">SUB TOTAL</TableColumn>
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

      <Divider />

      <div>
        <button className="bg-green-600 text-white p-2 rounded-md w-full">Download Invoice</button>
      </div>
    </div>
  );
};

export default MainContent;
