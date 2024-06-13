import Image from "next/image";

const DataPerusahaan = () => (
  <section className="flex">
    <Image
      className="aspect-[183/238] max-h-[238] max-w-[185px] rounded-md object-cover"
      height={2000}
      width={2000}
      alt="placeholder-image"
      src="/sales_image.jpg"
    />

    <div className="ml-8 flex flex-col justify-between">
      <div>
        <h1 className="text-[1.85vh] font-bold leading-[2.5vh]">NAMA </h1>
        <h1 className="text-[1.85vh] font-bold leading-[2.5vh]">
          NAMA PERUSAHAAN{" "}
        </h1>
        <h1 className="text-[1.85vh] font-bold leading-[2.5vh]">
          ALAMAT PERUSAHAAN
        </h1>
        <h1 className="text-[1.85vh] font-bold leading-[2.5vh]">NPWP</h1>
        <h1 className="text-[1.85vh] font-bold leading-[2.5vh]">NO. IPAK</h1>
        <h1 className="text-[1.85vh] font-bold leading-[2.5vh]">ALAMAT NPWP</h1>
      </div>
      <div className="mt-4 text-[1.3vh]">
        <h2 className="font-bold opacity-50">JUMLAH PROFORMA INVOICE</h2>
        <h2 className="font-bold opacity-50">JUMLAH PURCHASE ORDER</h2>
      </div>
    </div>
  </section>
);

export default DataPerusahaan;
