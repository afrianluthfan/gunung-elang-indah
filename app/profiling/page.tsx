import Sidebar from "@/components/Sidebar";
import { Button, Card, Divider, Input } from "@nextui-org/react";
import Image from "next/image";

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
          <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
            <div className="flex gap-4">
              <div className="flex w-full flex-col justify-between">
                <h1 className="text-xl font-bold lg:text-[1.85vh]">
                  Cek Profile Customer
                </h1>
                <Input
                  type="text"
                  placeholder="Masukan ID Customer / Atau Cek by Nama Customer"
                />
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
            <Divider />
            <div className="flex">
              <Image
                className="aspect-[183/238] max-h-[238] max-w-[185px] rounded-md object-cover"
                height={2000}
                width={2000}
                alt="placeholder-image"
                src="/sales_image.jpg"
              />

              <div className="ml-8 flex flex-col justify-between">
                <div>
                  <h1 className="text-[1.85vh] font-bold leading-[2.5vh]">
                    NAMA{" "}
                  </h1>
                  <h1 className="text-[1.85vh] font-bold leading-[2.5vh]">
                    NAMA PERUSAHAAN{" "}
                  </h1>
                  <h1 className="text-[1.85vh] font-bold leading-[2.5vh]">
                    ALAMAT PERUSAHAAN
                  </h1>
                  <h1 className="text-[1.85vh] font-bold leading-[2.5vh]">
                    NPWP
                  </h1>
                  <h1 className="text-[1.85vh] font-bold leading-[2.5vh]">
                    NO. IPAK
                  </h1>
                  <h1 className="text-[1.85vh] font-bold leading-[2.5vh]">
                    ALAMAT NPWP
                  </h1>
                </div>
                <div className="mt-4 text-[1.3vh]">
                  <h2 className="font-bold opacity-50">
                    JUMLAH PROFORMA INVOICE
                  </h2>
                  <h2 className="font-bold opacity-50">
                    JUMLAH PURCHASE ORDER
                  </h2>
                </div>
              </div>
            </div>
            <div className="flex h-full flex-col">
              <h1 className="text-[1.5vh] font-bold">Riwayat Order Barang</h1>
              <div className="mt-2 flex h-full w-full justify-between gap-3">
                <Card className="h-full w-full" />
                <Card className="h-full w-full" />
                <Card className="h-full w-full" />
                <Card className="h-full w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ProfilingPage;
