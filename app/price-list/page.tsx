"use client"; // Tambahkan ini di bagian paling atas

import MainContentLayout from "../../components/layouts/MainContentLayout";
import WelcomingMessage from "../../components/WelcomingMessage";
import MainContent from "./MainContent";


const ProfilingPage = () => {
  return (
    <section className="flex max-h-screen">
      {/* Main Content */}
      <div className="ml-0 h-screen w-full bg-[#EFEFEF] text-black md:ml-[17.3vw] md:w-[82.7vw]">
        <WelcomingMessage />
        <MainContentLayout>
          <MainContent />
        </MainContentLayout>
      </div>
    </section>
  );
};

export default ProfilingPage;
