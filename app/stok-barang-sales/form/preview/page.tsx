import Sidebar from "../../../../components/Sidebar";
import WelcomingMessage from "../../../../components/WelcomingMessage";
import React, { FC } from "react";
import MainContent from "./MainContent";
import FormMainContentLayout from "../FormMainContentLayout";

interface pageProps {}

const Form: FC<pageProps> = ({}) => {
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
            <FormMainContentLayout>
              <MainContent />
            </FormMainContentLayout>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Form;
