"use client"; // Tambahkan ini di bagian paling atas

import MainContent from "./MainContent";
import MainContentLayout from "@/components/layouts/MainContentLayout";
import Sidebar from "@/components/Sidebar";
import WelcomingMessage from "@/components/WelcomingMessage";
import { useState } from "react";

const ProfilingPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <section className="flex max-h-screen">
      
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-full transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-[60vw] md:w-[35.3vw]`}
      >
        <Sidebar />
      </div>

      {/* Button to toggle Sidebar */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-full"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? "Close" : "Menu"}
      </button>

      {/* Main Content */}
      <div className="ml-0 md:ml-[17.3vw] h-screen w-full md:w-[82.7vw] bg-[#EFEFEF] text-black">
        <WelcomingMessage />
        <MainContentLayout>
          <MainContent />
        </MainContentLayout>
      </div>
    </section>
  );
};

export default ProfilingPage;
