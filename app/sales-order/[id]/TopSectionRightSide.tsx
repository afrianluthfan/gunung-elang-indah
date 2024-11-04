"use client";


import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../../../redux/store";
import ModalComponent from "../../../components/ModalComponent";

const TopSectionRightSide = () => {
  const user = useAppSelector((state) => state.auth.value.username);
  const router = useRouter();
  let ButtonContent = <></>;

  switch (user) {
    case "sales":
      ButtonContent = (
        <Button
          onClick={() => router.push("/proforma-invoice/form")}
          className="bg-[#00DC16] font-bold text-white"
        >
          Tambah
        </Button>
      );
      break;
    case "admin":
      ButtonContent = <ModalComponent ButtonText="Tambah" />;
      break;
  }

  return (
    <div className="flex w-[8vw] flex-col gap-1">
      {ButtonContent}
      <Button className="bg-[#0C295F] font-bold text-white">Cari/Cek</Button>
    </div>
  );
};

export default TopSectionRightSide;
