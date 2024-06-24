import Sidebar from "@/components/Sidebar";
import WelcomingMessage from "@/components/WelcomingMessage";
import React, { FC } from "react";
import MainContent from "./MainContent";
import FormMainContentLayout from "./FormMainContentLayout";

interface pageProps {}

const Form: FC<pageProps> = ({}) => {
  return (
    <section className="flex max-h-screen">
      {/* sidebar */}
      <Sidebar />

      <div className="h-screen w-[82.7vw] bg-[#EFEFEF] text-black">
        {/* top bar that says "Welcome, {user}" */}
        <WelcomingMessage />
        {/* main content */}
        <FormMainContentLayout>
          <MainContent />
        </FormMainContentLayout>
      </div>
    </section>
  );
};

export default Form;
