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
import { setSalesPIInquiry } from "@/redux/features/salesPIInquiry-slice";

const Form: FC = () => {
  const data = useAppSelector((state) => state.itemPIReducer.value);
  const dataItem = useAppSelector((state) => state.listItemPIReducer.value);
  const amount: number = useAppSelector(
    (state) => state.salesPIItemNumberReducer.value.amount,
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

  const inquireData = async () => {
    const requestBody = {
      id_divisi: findIdByDivisi(data.divisi.toUpperCase())?.toString(), // Set id_divisi based on divisi value
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
        discount: item.disc.toString(),
      })),
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/proforma-invoice/inquiry",
        requestBody,
      );
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
      dispatch(setSalesPIInquiry(responseData));
      router.push("/proforma-invoice/form/preview");
    } catch (error) {
      console.error("Error inquiring data");
      throw error;
    }
  };

  return (
    <section className="flex max-h-screen">
      {/* sidebar */}
      <Sidebar />

      <div className="ml-[17.3vw] flex h-fit min-h-screen w-[82.7vw] flex-col bg-[#EFEFEF] text-black">
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
            <Button
              onClick={handleSetData}
              color="primary"
              className="min-w-36"
            >
              Next
            </Button>
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
