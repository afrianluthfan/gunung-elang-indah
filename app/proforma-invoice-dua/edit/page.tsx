"use client";

import WelcomingMessage from "../../../components/WelcomingMessage";
import React, { FC, useEffect, useState } from "react";
import FormMainContentLayout from "../form/FormMainContentLayout";
import { useAppSelector } from "../../../redux/store";
import MainContent from "./MainContent";
import ItemInput from "../form/ItemInput";
import axios from "axios";
// import MainContent from "../MainContent";

const Form: FC = () => {
  type ItemDataType = {
    id: number;
    name: string;
    total: string;
    price: string;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
  };

  const user = useAppSelector((state) => state.auth.value).username;
  const itemDetail = useAppSelector((state) => state.editPIItems.value);
  const [itemListData, setItemListData] = useState<ItemDataType[]>([]);
  const [content, setContent] = useState<JSX.Element[]>([]);
  let mainContent = <></>;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  mainContent = <MainContent />;

  useEffect(() => {
    const fetchItemListData = async () => {
      try {
        const response = await axios.post(
          `${apiUrl}/stock-barang/list`,
          "",
        );
        setItemListData(response.data.data);
        const newContent = itemDetail.map((item, index) => (
          <FormMainContentLayout key={index}>
            <ItemInput
              itemNumber={index + 1}
              index={index}
              // itemData={item}
              // autocompleteData={response.data.data} // Pass autocompleteData here
            />
          </FormMainContentLayout>
        ));
        setContent(newContent);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchItemListData();
  }, [itemDetail]);

  return (
    <section className="flex max-h-screen">
      <div className="ml-0 h-screen w-full bg-[#EFEFEF] text-black md:ml-[17.3vw] md:w-[82.7vw]">
        <WelcomingMessage />
        <div className="flex h-[88.5vh] w-full flex-col items-center justify-between px-[1.6vw] pt-[2vh]">
          <div className="flex w-full flex-col gap-5">
            <FormMainContentLayout>{mainContent}</FormMainContentLayout>
            {/* {itemDetail && content} */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Form;
