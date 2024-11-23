
import React, { FC } from "react";
import MainContent from "./MainContent";
import WelcomingMessage from "../../../components/WelcomingMessage";

interface pageProps {}

const Form: FC<pageProps> = ({}) => {
  return (
    <section className="flex max-h-screen">
      {/* sidebar */}
      {/* <Sidebar /> */}

      <div className="ml-0 h-screen w-full bg-[#FFFFFF] text-black md:ml-[17.3vw] md:w-[82.7vw]">
        {/* top bar that says "Welcome, {user}" */}
        <WelcomingMessage />
        {/* main content */}
        {/* <MainContentLayout> */}
        <MainContent />
        {/* </MainContentLayout> */}
      </div>
    </section>
  );
};

export default Form;
