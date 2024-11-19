"use client";

import React, { FC,} from "react";
import FormMainContentLayout from "./FormMainContentLayout";
import MainContent from "./MainContent";
import Sidebar from "../../../components/Sidebar";
import WelcomingMessage from "../../../components/WelcomingMessage";
const Form: FC = () => {

  let mainContent = <></>;

  mainContent = <MainContent />;

  return (
    <section className="flex max-h-screen">
      <Sidebar />
      <div className="ml-[17.3vw] flex max-h-screen w-[82.7vw] flex-col bg-[#EFEFEF] text-black">
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
