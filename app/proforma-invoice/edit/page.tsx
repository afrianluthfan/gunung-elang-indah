"use client";

import Sidebar from "@/components/Sidebar";
import WelcomingMessage from "@/components/WelcomingMessage";
import React, { FC, useEffect, useState } from "react";
import FormMainContentLayout from "../form/FormMainContentLayout";
import { useAppSelector } from "@/redux/store";
import AdminMainContent from "./(admin)/MainContent";
import SalesMainContent from "./(sales)/MainContent";
import ItemInput from "../form/ItemInput";

interface pageProps {}

const Form: FC<pageProps> = ({}) => {
  const user = useAppSelector((state) => state.authReducer.value).username;

  const itemDetail = useAppSelector((state) => state.editPIItems.value);

  const [content, setContent] = useState<JSX.Element[]>([]);
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
    console.log("itemDetail.length: ", itemDetail);
    const newContent = itemDetail.map((item, index) => (
      <FormMainContentLayout key={index}>
        <ItemInput itemNumber={index + 1} index={index} itemData={item} />
      </FormMainContentLayout>
    ));
    setContent(newContent);
  }, [itemDetail]);

  return (
    <section className="flex max-h-screen">
      <Sidebar />
      <div className="ml-[17.3vw] flex max-h-screen w-[82.7vw] flex-col bg-[#EFEFEF] text-black">
        <WelcomingMessage />
        <div className="flex h-[88.5vh] w-full flex-col items-center justify-between px-[1.6vw] pt-[2vh]">
          <div className="flex w-full flex-col gap-5">
            <FormMainContentLayout>{mainContent}</FormMainContentLayout>
            {content}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Form;
