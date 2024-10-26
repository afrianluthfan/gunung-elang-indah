"use client";

import Sidebar from "@/components/Sidebar";
import WelcomingMessage from "@/components/WelcomingMessage";
import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import FormMainContentLayout from "@/app/proforma-invoice-dua/form/FormMainContentLayout";
import MainContent from "./MainContent";

const Form: FC = () => {
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
          </div>

          <div className="flex h-[4vh] items-center justify-center text-end font-semibold">
            <h1>Supported by PT Gunung Elang Indah</h1>
          </div>
        </div>
      </div>{" "}
    </section>
  );
};

export default Form;
