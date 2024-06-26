import MainContentLayout from "@/components/layouts/MainContentLayout";
import Sidebar from "@/components/Sidebar";
import WelcomingMessage from "@/components/WelcomingMessage";
import React, { FC } from "react";
import MainContent from "./MainContent";

interface pageProps {}

const Form: FC<pageProps> = ({}) => {
  return (
    <section className="flex max-h-screen">
      {/* sidebar */}
      <Sidebar />

      <div className="ml-[17.3vw] h-screen w-[82.7vw] bg-[#EFEFEF] text-black">
        {/* top bar that says "Welcome, {user}" */}
        <WelcomingMessage />
        {/* main content */}
        <MainContentLayout>
          <MainContent />
        </MainContentLayout>
      </div>
    </section>
  );
};

export default Form;
