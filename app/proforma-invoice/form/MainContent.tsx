"use client";

import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import TopSectionLeftSide from "./TopSectionLeftSide";
import { Button, Divider, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { itemNumber } from "./itemNumber";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setItemPI } from "@/redux/features/itemPI-slice";
import { setAmount } from "@/redux/features/salesPIItemNumber-slice";
import { FC, useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import axios from "axios";
import AutocompleteSearch from "@/components/AutocompleteSearch";

type FormFields = {
  divisi: string;
  nomorInvoice: string;
  jatuhTempo: string;
  nomorSuratJalan: string;
  nomorPI: string;
  namaRumahSakit: string;
  jumlahBarang: string;
  tanggal: string;
  alamatRumahSakit: string;
  rm: string;
  tanggalTindakan: string;
  namaDokter: string;
};

const MainContent: FC = () => {
  const [selectedDivisi, setSelectedDivisi] = useState<string>("");
  const [rsData, setRsData] = useState<
    { id: number; name: string; address_company: string }[]
  >([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const { register, setValue, watch } = useForm<FormFields>();

  useEffect(() => {
    const fetchRsData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/proforma-invoice/rs-list",
          "",
        );
        setRsData(response.data.data);
        console.log("rsData: ", rsData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchRsData();
  }, [rsData]);

  const dispatch = useDispatch<AppDispatch>();

  const handleDivisiChange = (selectedItem: string) => {
    setSelectedDivisi(selectedItem);
    const amount = parseInt(selectedItem);
    dispatch(setAmount(amount));
  };

  const handleRSChange = (address: string) => {
    console.log("jalan handleRSChange");
    if (selectedAddress !== address) {
      setSelectedAddress(address);
      setValue("alamatRumahSakit", address);
    }
  };

  useEffect(() => {
    setValue("divisi", selectedDivisi);
  }, [selectedDivisi, setValue]);

  const alamatRumahSakit = watch("alamatRumahSakit");

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
            data={[
              { value: "radiologi", label: "Radiologi" },
              { value: "ortopedi", label: "Ortopedi" },
            ]}
            label="Divisi"
            placeholder="Pilih Divisi"
            statePassing={handleDivisiChange}
          />

          <Input {...register("nomorInvoice")} label="Nomor Invoice" />
          <Input {...register("jatuhTempo")} label="Jatuh Tempo" />
          {selectedDivisi === "radiologi" && (
            <Input {...register("rm")} label="RM" />
          )}
          {selectedDivisi === "ortopedi" && (
            <Input {...register("nomorSuratJalan")} label="Nomor Surat Jalan" />
          )}
        </div>

        {/* second column */}
        <div className="flex flex-col gap-3">
          <Input label="oadk" className="invisible" />

          {selectedDivisi === "radiologi" ? (
            <Input {...register("nomorPI")} label="Nomor PI" />
          ) : (
            <Input {...register("tanggalTindakan")} label="Tanggal Tindakan" />
          )}
          {selectedDivisi === "ortopedi" && (
            <AutocompleteSearch
              data={rsData}
              label="Nama Rumah Sakit"
              correspondingCity={handleRSChange}
            />
          )}
          {selectedDivisi === "radiologi" && (
            <Input {...register("namaDokter")} label="Nama Dokter" />
          )}
        </div>

        {/* third column */}
        <div className="flex flex-col gap-3">
          <Dropdown
            data={itemNumber}
            label="Jumlah Barang"
            placeholder="Pilih jumlah barang"
          />
          <Input {...register("tanggal")} label="Tanggal" />
          <Input
            readOnly
            {...register("alamatRumahSakit")}
            label="Alamat Rumah Sakit"
            value={alamatRumahSakit} // This will be automatically updated based on the watch
          />
        </div>
      </form>
    </div>
  );
};

export default MainContent;
