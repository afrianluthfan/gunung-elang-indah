"use client";

import WelcomingMessage from "@/components/WelcomingMessage";
import React, { FC, useEffect, useState } from "react";
import FormMainContentLayout from "../FormMainContentLayout";
import MainContent from "./MainContent";
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

  let mainContent = <></>;

  mainContent = <MainContent />;

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
