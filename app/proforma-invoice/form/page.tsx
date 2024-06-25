"use client";

import Sidebar from "@/components/Sidebar";
import WelcomingMessage from "@/components/WelcomingMessage";
import React, { FC, useEffect, useRef } from "react";
import MainContent from "./MainContent";
import FormMainContentLayout from "./FormMainContentLayout";
import ItemInput from "./ItemInput";
import { useAppSelector } from "@/redux/store";

interface pageProps {}

const Form: FC<pageProps> = ({}) => {
  const data = useAppSelector((state) => state.itemPIReducer.value);
  const contentRef = useRef<JSX.Element | null>(null);
  useEffect(() => {
    if (data) {
      contentRef.current = (
        <FormMainContentLayout>
          <ItemInput />
        </FormMainContentLayout>
      );
    }
  }, [data]);

  return (
    <section className="flex max-h-screen">
      {/* sidebar */}
      <Sidebar />

      <div className="flex max-h-screen w-[82.7vw] flex-col bg-[#EFEFEF] text-black">
        {/* top bar that says "Welcome, {user}" */}
        <WelcomingMessage />
        {/* main content */}
        <div className="flex h-[88.5vh] w-full flex-col items-center justify-between px-[1.6vw] pt-[2vh]">
          <div className="flex w-full flex-col gap-5">
            <FormMainContentLayout>
              <MainContent />
            </FormMainContentLayout>
            {contentRef.current}
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
