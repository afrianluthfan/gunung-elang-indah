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
  const [filled, setFilled] = useState<boolean>(false);
  const [dropdownData, setDropdownData] = useState<
    { value: string; label: string }[]
  >([]);
  const [rsData, setRsData] = useState<any[]>([]); // Store the raw fetched data

  const { register, handleSubmit, getValues, setValue, watch } =
    useForm<FormFields>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/proforma-invoice/rs-list",
          "",
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching data", error);
        return { data: [] }; // Ensure the data property exists in the fallback
      }
    };
    const settingDropdownData = async () => {
      const tempData = await fetchData();
      if (Array.isArray(tempData.data)) {
        setRsData(tempData.data); // Store the raw data
        const transformedData = tempData.data.map((item: any) => ({
          value: item.name,
          label: item.name,
        }));
        setDropdownData(transformedData);
        console.log("transformedData: ", transformedData);
      } else {
        console.error("Fetched data is not an array", tempData);
      }
    };
    settingDropdownData();
  }, []);

  const dispatch = useDispatch<AppDispatch>();

  const handleSetData = async () => {
    dispatch(setItemPI(getValues()));
    axios.post("http://localhost:8080/api/customer-profilling/get-tax-code");
  };

  const handleDivisiChange = async (selectedItem: string) => {
    setSelectedDivisi(selectedItem);
    setFilled(true);
    const amount = parseInt(selectedItem);
    dispatch(setAmount(amount));

    // Find the corresponding address for the selected divisi
    const selectedRs = rsData.find((rs) => rs.name === selectedItem);
    if (selectedRs) {
      setValue("alamatRumahSakit", selectedRs.address_company);
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
            data={dropdownData}
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
          {selectedDivisi === "radiologi" && (
            <Input {...register("namaDokter")} label="Nama Dokter" />
          )}

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
          <Input
            readOnly
            {...register("alamatRumahSakit")}
            label="Alamat Rumah Sakit"
            value={alamatRumahSakit} // This will be automatically updated based on the watch
          />
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
