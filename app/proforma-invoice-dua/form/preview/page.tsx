import WelcomingMessage from "@/components/WelcomingMessage";
import React, { FC } from "react";
import MainContent from "./MainContent";
import FormMainContentLayout from "../FormMainContentLayout";

interface pageProps {}

const Form: FC<pageProps> = ({}) => {
  return (
    <section>
      <div className="ml-0 flex h-screen w-screen flex-col bg-[#EFEFEF] text-black md:ml-[17.3vw] md:w-[82.7vw]">
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
