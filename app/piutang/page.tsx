import Sidebar from "@/components/Sidebar";
import MainContent from "./MainContent";
import MainContentLayout from "@/components/layouts/MainContentLayout";
import WelcomingMessage from "@/components/WelcomingMessage";

const ProfilingPage = () => (
  <section className="flex max-h-screen">
    {/* sidebar */}
    <Sidebar />

    <div className="h-screen w-[82.7vw] bg-[#EFEFEF] text-black">
      {/* top bar that says "Welcome, {user}" */}
      <WelcomingMessage user="Staff Finance" />
      {/* main content */}
      <MainContentLayout>
        <MainContent />
      </MainContentLayout>
    </div>
  </section>
);

export default ProfilingPage;