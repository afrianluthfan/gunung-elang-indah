"use client";

import { useRouter } from "next/navigation";

const TopSectionRightSide = () => {
  const router = useRouter();
  return (
    <div className="flex w-[8vw] flex-col gap-1">
      {/* <Button
        onClick={() => router.push("/stok-barang/form")}
        className="bg-[#00DC16] font-bold text-white"
      >
        Tambah
      </Button> */}
      <div className="mb-6  "></div>
      
    </div>
  );
};

export default TopSectionRightSide;
