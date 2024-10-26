"use client";

import Sidebar from "@/components/Sidebar";
import WelcomingMessage from "@/components/WelcomingMessage";
import React, { FC, useEffect, useState } from "react";
import MainContent from "./MainContent";
import FormMainContentLayout from "./FormMainContentLayout";
import ItemInput from "./ItemInput";
import { useAppSelector } from "@/redux/store";
import { setListItems } from "@/redux/features/listItemPI-slice";
import { useDispatch } from "react-redux";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { setSalesPOInquiry } from "@/redux/features/salesPOInquiry-slice";
import { setSalesPIInquiry } from "@/redux/features/salesPIInquiry-slice";

const Form: FC = () => {
  const data = useAppSelector((state) => state.itemPO.value);
  const dataItem = useAppSelector((state) => state.listItemPO.value);
  const amount: number = useAppSelector(
    (state) => state.salesPIItemNumber.value.amount,
  );

  const [content, setContent] = useState<JSX.Element[]>([]);
  const [divisiList, setDivisiList] = useState<{ id: number; name: string }[]>(
    [],
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const findIdByDivisi = (divisi: string) => {
    const selectedDivisi = divisiList.find((item) => item.name == divisi);
    return selectedDivisi ? selectedDivisi.id : null;
  };

  useEffect(() => {
    const initialItems = Array.from({ length: amount }, () => ({
      kat: "",
      hSatuan: "",
      namaBarang: "",
      disc: "",
      qty: "",
      subTotal: "",
    }));

    dispatch(setListItems(initialItems));

    const newContent = initialItems.map((_, index) => (
      <FormMainContentLayout key={index}>
        <ItemInput itemNumber={index + 1} index={index} />
      </FormMainContentLayout>
    ));
    setContent(newContent);
  }, [amount, data, dispatch]);

  useEffect(() => {
    const fetchDivisiList = async () => {
      try {
        const responseDivisi = await axios.post(
          `${apiUrl}/proforma-invoice/divisi-list",
          "",
        );
        setDivisiList(responseDivisi.data.data);
      } catch (error) {
        console.error("Gagal fetching list divisi!");
      }
    };
    fetchDivisiList();
  }, []);

  const inquireData = async () => {
    const requestBody = {
      // id_divisi: findIdByDivisi(data.divisi.toUpperCase())?.toString(), // Set id_divisi based on divisi value
      catatan_po: data.note,
      prepared_by: data.prepared_by,
      prepared_jabatan: data.jabatan,
      approved_by: data.approved_by,
      approved_jabatan: data.jabatan_approve, // Fill this as per your application logic
      nama_suplier: data.to_supplier,
      // id_rumah_sakit: data.idRS, // Fill this as per your application logic
      // tanggal_tindakan: data.tanggal,
      item: dataItem.map((item) => ({
        // kat: item.kat,
        // nama_barang: item.namaBarang,
        // quantity: item.qty,
        // harga_satuan: item.hSatuan,
        // discount: item.disc.toString(),

        price: item.price,
        quantity: item.quantity,
        name: item.name,
        discount: item.discount,
      })),
    };

    try {
      const response = await axios.post(
        `${apiUrl}/purchase-order/inquiry",
        requestBody,
      );
      // if (response.status === 200) {
      // Clear requestBody
      requestBody.catatan_po = "";
      requestBody.prepared_by = "";
      requestBody.prepared_jabatan = "";
      requestBody.approved_by = "";
      requestBody.approved_jabatan = "";
      requestBody.nama_suplier = "";
      requestBody.item = [];
      console.log("Request body cleared successfully.");
      // }
      return response.data.data;
    } catch (error) {
      console.error("Error inquiring data", error);
      throw error;
    }
  };

  const handleSetData = async () => {
    try {
      const responseData = await inquireData();
      console.log("response data: ", responseData);
      dispatch(setSalesPOInquiry(responseData));
      router.push("/purchase-order/form/preview");
    } catch (error) {
      console.error("Error inquiring data");
      throw error;
    }
  };

  // const handleSetData = async () => {
  //   const router = useRouter();

  //   try {
  //     const responseData = await inquireData();
  //     console.log("response data: ", responseData);

  //     // Convert responseData to a JSON string
  //     const query: Record<string, string> = {
  //       data: JSON.stringify(responseData.data),
  //       message: responseData.message,
  //       status: responseData.status.toString(),
  //     };

  //     // Navigate to the new route with query parameters
  //     router.push({
  //       pathname: '/proforma-invoice/form/preview',
  //       query: query,
  //     } as any);
  //   } catch (error) {
  //     console.error("Error inquiring data");
  //     throw error;
  //   }
  // };

  return (
    <section className="flex max-h-screen">
      {/* sidebar */}
      {/* <Sidebar /> */}

      <div className="ml-0 h-screen w-full bg-[#EFEFEF] text-black md:ml-[17.3vw] md:w-[82.7vw]">
        {/* top bar that says "Welcome, {user}" */}
        <WelcomingMessage />
        {/* main content */}
        <div className="flex min-h-[88.5vh] w-full flex-col items-center justify-between px-[1.6vw] pt-[2vh]">
          <div className="flex w-full flex-col gap-5">
            <FormMainContentLayout>
              <MainContent />
            </FormMainContentLayout>
            {data && content}
          </div>
          <div className="flex w-full justify-end">
            {/* <Button
              onClick={handleSetData}
              color="primary"
              className="min-w-36"
            >
              Next
            </Button> */}
          </div>
          <div className="flex h-[4vh] items-center justify-center text-end font-semibold">
            <h1>Supported by PT Gunung Elang Indah</h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Form;
