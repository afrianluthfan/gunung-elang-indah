"use client";

import Sidebar from "@/components/Sidebar";
import WelcomingMessage from "@/components/WelcomingMessage";
import React, { FC, useEffect, useState } from "react";
import FormMainContentLayout from "../form/FormMainContentLayout";
import { useAppSelector } from "@/redux/store";
import AdminMainContent from "./(admin)/MainContent";
import SalesMainContent from "./(sales)/MainContent";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import ItemInput from "../form/ItemInput";

interface pageProps {}

const Form: FC<pageProps> = ({}) => {
  const user = useAppSelector((state) => state.authReducer.value).username;

  const [amount, setAmount] = useState<number>(0);
  const [data, setData] = useState<any>(null); // Added state to hold the response data
  const searchParams = useSearchParams();
  let mainContent = <></>;

  switch (user) {
    case "admin":
      mainContent = <AdminMainContent />;
      break;
    case "sales":
      mainContent = <SalesMainContent />;
      break;
    default:
      mainContent = <></>;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/proforma-invoice/detailPI",
          {
            id: searchParams.get("id"),
            divisi: searchParams.get("divisi"),
          },
        );

        if (
          response.data &&
          response.data.data &&
          response.data.data.item_detail_pi
        ) {
          setAmount(response.data.data.item_detail_pi.length); // Set the amount state
          setData(response.data.data); // Store the entire response data
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [searchParams]);

  useEffect(() => {
    const initialItems = Array.from({ length: amount }, () => ({
      kat: "",
      hSatuan: "",
      namaBarang: "",
      disc: "",
      qty: "",
      subTotal: "",
    }));

    // Assuming you have a dispatch and setListItems function
    // dispatch(setListItems(initialItems));

    const newContent = initialItems.map((_, index) => (
      <FormMainContentLayout key={index}>
        {/* Assuming ItemInput is defined and imported */}
        <ItemInput itemNumber={index + 1} index={index} />
      </FormMainContentLayout>
    ));
    // Assuming setContent is defined and imported
    // setContent(newContent);
  }, [amount, data]);

  return (
    <section className="flex max-h-screen">
      {/* sidebar */}
      <Sidebar />
      <div className="ml-[17.3vw] flex max-h-screen w-[82.7vw] flex-col bg-[#EFEFEF] text-black">
        <WelcomingMessage />
        <div className="flex h-[88.5vh] w-full flex-col items-center justify-between px-[1.6vw] pt-[2vh]">
          <div className="flex w-full flex-col gap-5">
            {/* top bar that says "Welcome, {user}" */}
            {/* main content */}
            <FormMainContentLayout>{mainContent}</FormMainContentLayout>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Form;
