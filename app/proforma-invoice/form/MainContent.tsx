"use client";

import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import TopSectionLeftSide from "./TopSectionLeftSide";
import { Button, Divider, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { data } from "./data";
import { itemNumber } from "./itemNumber";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setItemPI } from "@/redux/features/itemPI-slice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";

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
  const [selectedDivisi, setSelectedDivisi] = useState<string>("");
  const [selectedJumlahBarang, setSelectedJumlahBarang] = useState<string>("");

  const { register, handleSubmit, getValues, setValue } = useForm<FormFields>();

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleSetData = () => {
    dispatch(setItemPI(getValues()));
    router.push("/proforma-invoice/form/preview");
  };

  const handleDivisiChange = (selectedItem: string) => {
    setSelectedDivisi(selectedItem);
  };

  const handleJumlahBarangChange = (selectedItem: string) => {
    setSelectedJumlahBarang(selectedItem);
  };

  useEffect(() => {
    setValue("divisi", selectedDivisi);
  }, [selectedDivisi, setValue]);

  useEffect(() => {
    setValue("jumlahBarang", selectedJumlahBarang);
  }, [selectedJumlahBarang, setValue]);

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
          <Dropdown
            data={data}
            label="Divisi"
            placeholder="Pilih Divisi"
            statePassing={handleDivisiChange}
          />
          <Input {...register("nomorInvoice")} label="Nomor Invoice" />
          <Input {...register("jatuhTempo")} label="Jatuh Tempo" />
          <Input {...register("nomorSI")} label="Nomor SI" />
        </div>
        {/* second column */}
        <div className="flex flex-col gap-3">
          <Input label="oadk" className="invisible" />
          <Input {...register("nomorPI")} label="Nomor PI" />
          <Input {...register("namaRumahSakit")} label="Nama Rumah Sakit" />
        </div>
        {/* third column */}
        <div className="flex flex-col gap-3">
          <Dropdown
            data={itemNumber}
            label="Jumlah Barang"
            placeholder="Pilih jumlah barang"
            statePassing={handleJumlahBarangChange}
          />
          <Input {...register("tanggal")} label="Tanggal" />
          <Input {...register("alamatRumahSakit")} label="Alamat Rumah Sakit" />
        </div>
      </form>
    </div>
  );
};

export default MainContent;
