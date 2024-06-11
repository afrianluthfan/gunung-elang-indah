import Sidebar from "@/components/Sidebar";
import { Button, Divider, Input } from "@nextui-org/react";

const ProfilingPage = () => (
  <section className="flex max-h-screen">
    {/* sidebar */}
    <Sidebar />

    {/* main content */}
    <div className="h-screen w-[82.7vw] bg-[#EFEFEF] text-black">
      {/* top bar */}
      <div className="flex h-[11.5vh] w-full bg-white px-10 py-7 text-black">
        <div className="h-full w-[3px] bg-black" />
        <div className="ml-1 flex h-full flex-col justify-between">
          <h1 className="text-2xl font-bold">Selamat Datang</h1>
          <p>Staff Sales</p>
        </div>
      </div>

      <div className="flex h-[88.5vh] w-full items-center justify-center px-[1.6vw] py-[4vh]">
        <div className="h-full w-full rounded-xl bg-white">
          <div className="flex w-full justify-between gap-6 p-8">
            <div className="flex w-full flex-col justify-between">
              <h1 className="text-xl font-bold">Cek Profile Customer</h1>
              <Input type="text" placeholder="Search..." />
            </div>
            <div className="flex w-[8vw] flex-col gap-1">
              <Button className="bg-[#00DC16] font-bold text-white">
                Tambah
              </Button>
              <Button className="bg-[#00186D] font-bold text-white">
                Cari/Cek
              </Button>
            </div>
          </div>
          <div className="h-fit w-full px-8">
            <Divider />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ProfilingPage;
