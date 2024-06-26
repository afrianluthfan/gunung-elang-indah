"use client";

import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import TopSectionLeftSide from "./TopSectionLeftSide";
import { Button, Divider, Input } from "@nextui-org/react";
import { set, useForm } from "react-hook-form";
import { data } from "./data";
import { itemNumber } from "./itemNumber";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setItemPI } from "@/redux/features/itemPI-slice";
import { setAmount } from "@/redux/features/salesPIItemNumber-slice";
import { FC, useEffect, useState } from "react";
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

const MainContent: FC = () => {
  const [selectedDivisi, setSelectedDivisi] = useState<string>("");
  const [filled, setFilled] = useState<boolean>(false);

  const { register, handleSubmit, getValues, setValue } = useForm<FormFields>();

  const dispatch = useDispatch<AppDispatch>();

  const handleSetData = () => {
    dispatch(setItemPI(getValues()));
    console.log("values: ", getValues());
  };

  const handleDivisiChange = (selectedItem: string) => {
    setSelectedDivisi(selectedItem);
    setFilled(true);
    const amount = parseInt(selectedItem);
    dispatch(setAmount(amount));
  };

  useEffect(() => {
    setValue("divisi", selectedDivisi);
  }, [selectedDivisi, setValue]);

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
          />
          <Input {...register("tanggal")} label="Tanggal" />
          <Input {...register("alamatRumahSakit")} label="Alamat Rumah Sakit" />
        </div>
      </form>
      {filled && (
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit(handleSetData)}
            color="primary"
            className="min-w-36"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default MainContent;
