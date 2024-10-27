import Sidebar from "@/components/Sidebar";
import MainContent from "./MainContent";
import MainContentLayout from "@/components/layouts/MainContentLayout";
import WelcomingMessage from "@/components/WelcomingMessage";

const ProfilingPage = () => (
  <section className="flex max-h-screen">
    {/* sidebar */}
    {/* <Sidebar /> */}

    <div className="ml-0 h-screen w-full bg-[#EFEFEF] text-black md:ml-[17.3vw] md:w-[82.7vw]">
      {/* top bar that says "Welcome, {user}" */}
      <WelcomingMessage />
      {/* main content */}
      <MainContentLayout>
        <MainContent />
      </MainContentLayout>
    </div>
  </section>
);

export default ProfilingPage;
