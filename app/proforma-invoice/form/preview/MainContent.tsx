"use client";

import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import TopSectionLeftSide from "../TopSectionLeftSide";
import { Button, Divider, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import Dropdown from "@/components/Dropdown";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setItemPI } from "@/redux/features/itemPI-slice";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";

type FormFields = {
  divisi: string;
  nomorInvoice: string;
  jatuhTempo: string;
  nomorSI: string;
  nomorPI: string;
  namaRumahSakit: string;
  jumlahBarang: string;
  tanggal: string;
  alamatRumahSakit: string;
};

const MainContent = () => {
  const data = useAppSelector((state) => state.itemPIReducer.value);
  const { register } = useForm<FormFields>();

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        {/* cek profile customer and searchbar */}
        <TopSectionLeftSide />
      </ContentTopSectionLayout>
      <Divider />
      <form className="grid h-full w-full grid-cols-3 gap-3">
        {/* first column */}
        <div className="flex flex-col gap-3">
          <Input
            isDisabled
            label="Divisi"
            defaultValue={
              data.divisi.charAt(0).toUpperCase() + data.divisi.slice(1)
            }
          />
          <Input
            isDisabled
            label="Nomor Invoice"
            defaultValue={data.nomorInvoice}
          />
          <Input
            isDisabled
            label="Jatuh Tempo"
            defaultValue={data.jatuhTempo}
          />
          <Input isDisabled label="Nomor SI" defaultValue={data.nomorSI} />
        </div>
        {/* second column */}
        <div className="flex flex-col gap-3">
          <Input label="oadk" className="invisible" />
          <Input isDisabled label="Nomor PI" defaultValue={data.nomorPI} />
          <Input
            isDisabled
            label="Nama Rumah Sakit"
            defaultValue={data.namaRumahSakit}
          />
        </div>
        {/* third column */}
        <div className="flex flex-col gap-3">
          <Input
            isDisabled
            label="Jumlah Barang"
            defaultValue={data.jumlahBarang}
          />
          <Input isDisabled label="Tanggal" defaultValue={data.tanggal} />
          <Input
            isDisabled
            label="Alamat Rumah Sakit"
            defaultValue={data.alamatRumahSakit}
          />
        </div>
      </form>
      <div className="flex justify-end">
        <Button color="primary" className="min-w-36">
          Next
        </Button>
      </div>
    </div>
  );
};

export default MainContent;
