"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface TopSectionRightSideProps {
  search: () => void;
}

const TopSectionRightSide: FC<TopSectionRightSideProps> = ({ search }) => {
  const router = useRouter();
  return (
    <div className="flex w-[8vw] gap-1 lg:flex-col">
      <Button
        onClick={() => router.push("/profiling/form")}
        className="bg-[#00DC16] font-bold text-white"
      >
        Tambah
      </Button>
      <Button className="bg-[#0C295F] font-bold text-white" onClick={search}>
        Cari/Cek
      </Button>
    </div>
  );
};

export default TopSectionRightSide;
