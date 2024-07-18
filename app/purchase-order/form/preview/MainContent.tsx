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
import { resetItemPO } from "@/redux/features/itemPo-slice";
import { clearSalesPOInquiry } from "@/redux/features/salesPOInquiry-slice";
import { resetListItemPO } from "@/redux/features/listItemPO-slice";
import { useRouter } from "next/navigation";


const MainContent = () => {
  const router = useRouter();
  const responseData = useAppSelector(
    (state) => state.salesPOInquirySliceReducer.value,
  );

  const dispatch = useDispatch();

  const submitData = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/purchase-order/posting",
        responseData,
      );
      dispatch(resetItemPO());
      dispatch(resetListItemPO());
      dispatch(clearSalesPOInquiry());
      router.push("/purchase-order");
    } catch (error) {
      console.error("Error inquiring data", error);
      throw error;
    }
  };

  const cancelData = async () => {
      dispatch(resetItemPO());
      dispatch(resetListItemPO());
      dispatch(clearSalesPOInquiry());
      router.push("/purchase-order");
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
          <h1>Nomor Purchase Order: {responseData.nomor_po}</h1>
          {/* <h1>Nomor Surat Jalan: {responseData.nomor_surat_jalan}</h1> */}
          <h1>Tanggal: {responseData.tanggal}</h1>
          {/* <h1>Jatuh Tempo: {responseData.jatuh_tempo}</h1> */}
          <h1>Catatan Purchase Order: {responseData.catatan_po}</h1>
        </div>
        <div className="flex flex-col">
          <h1>Prepared By: {responseData.prepared_by}</h1>
          <h1>Prepared Jabatan: {responseData.prepared_jabatan}</h1>
          <h1>Approved By: {responseData.approved_by}</h1>
          <h1>Approved Jabatan: {responseData.approved_jabatan}</h1>
        </div>
      </div>
      <Table removeWrapper aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>NO</TableColumn>
          <TableColumn>NAMA BARANG</TableColumn>
          <TableColumn>QUANTITY</TableColumn>
          <TableColumn>HARGA SATUAN</TableColumn>
          <TableColumn>DISCOUNT</TableColumn>
          <TableColumn>AMMOUNT</TableColumn>
        </TableHeader>
        <TableBody>
          {/* Map over dataItem to render each row */}
          {responseData.item.map((item, index) => (
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
        <p>{responseData.sub_total}</p>
        <p>PPN 11%: </p>
        <p>{responseData.pajak}</p>
        <p>Total: </p>
        <p>{responseData.total}</p>
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
