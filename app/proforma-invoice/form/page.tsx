"use client";

import Sidebar from "@/components/Sidebar";
import WelcomingMessage from "@/components/WelcomingMessage";
import React, { FC, useEffect, useRef, useState } from "react";
import MainContent from "./MainContent";
import FormMainContentLayout from "./FormMainContentLayout";
import ItemInput from "./ItemInput";
import { useAppSelector } from "@/redux/store";

const Form: FC = () => {
  const data = useAppSelector((state) => state.itemPIReducer.value);
  const contentRef = useRef<JSX.Element | null>(null);
  const amount: number = useAppSelector(
    (state) => state.salesPIItemNumberReducer.value.amount,
  );

  useEffect(() => {
    contentRef.current = (
      <>
        {Array.from({ length: amount }, (_, index) => (
          <FormMainContentLayout key={index}>
            <ItemInput itemNumber={index + 1} />
          </FormMainContentLayout>
        ))}
      </>
    );
  }, [amount, data]);

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
            {data && contentRef.current}
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
