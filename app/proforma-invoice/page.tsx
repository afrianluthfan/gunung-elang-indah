"use client";

import Sidebar from "@/components/Sidebar";
import MainContentLayout from "@/components/layouts/MainContentLayout";
import AdminMainContent from "../(admin)/AdminMainContent";
import SalesMainContent from "../(sales)/SalesMainContent";
import WelcomingMessage from "@/components/WelcomingMessage";
import { useAppSelector } from "@/redux/store";

const ProfilingPage = () => {
  const user = useAppSelector((state) => state.auth.value.username);
  let MainContent = <></>;
  switch (user) {
    case "sales":
      MainContent = <SalesMainContent />;
      break;
    case "admin":
      MainContent = <AdminMainContent />;
      break;
  }

  return (
    <section className="flex max-h-screen">
      {/* sidebar */}
      <Sidebar />

      <div className="ml-[17.3vw] h-screen w-[82.7vw] bg-[#EFEFEF] text-black">
        {/* top bar that says "Welcome, {user}" */}
        <WelcomingMessage />
        {/* main content */}
        <MainContentLayout>{MainContent}</MainContentLayout>
      </div>
    </section>
  );
};

export default ProfilingPage;
