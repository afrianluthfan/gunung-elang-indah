"use client";

import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import TopSectionLeftSide from "./TopSectionLeftSide";
import { Button, Divider, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { itemNumber } from "./itemNumber";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { resetItemPI, setItemPI } from "@/redux/features/itemPI-slice";
import { FC, useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import axios from "axios";
import AutocompleteSearch from "@/components/AutocompleteSearch";

type FormFields = {
  divisi: string;
  jatuhTempo: string;
  namaRumahSakit: string;
  jumlahBarang: string;
  alamatRumahSakit: string;
  rm: string;
  tanggalTindakan: string;
  namaDokter: string;
  namaPasien: string;
  tanggalInvoice: string;
};

const MainContent: FC = () => {
  const [selectedDivisi, setSelectedDivisi] = useState<string>("");
  const [rsData, setRsData] = useState<
    { id: number; name: string; address_company: string }[]
  >([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const { register, setValue, watch } = useForm<FormFields>();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchRsData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/proforma-invoice/rs-list",
          "",
        );
        setRsData(response.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchRsData();
  }, [selectedDivisi]);

  const handleDivisiChange = (selectedItem: string) => {
    setSelectedDivisi(selectedItem);
    dispatch(setItemPI({ divisi: selectedItem }));
  };

  const handleRSChange = (name: string, address: string) => {
    if (selectedAddress !== address) {
      setSelectedAddress(address);
      setValue("alamatRumahSakit", address);
      setValue("namaRumahSakit", name);
      dispatch(setItemPI({ namaRumahSakit: name, alamatRumahSakit: address }));
    }
  };

  const handleInputChange =
    (field: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setValue(field, value);
      dispatch(setItemPI({ [field]: value }));
    };

  useEffect(() => {
    setValue("divisi", selectedDivisi);
  }, [selectedDivisi, setValue]);

  useEffect(() => {
    const subscription = watch((value) => {
      dispatch(setItemPI(value));
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

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

          {selectedDivisi !== "" && (
            <Input
              {...register("jatuhTempo")}
              label="Jatuh Tempo"
              onChange={handleInputChange("jatuhTempo")}
            />
          )}

          {selectedDivisi === "radiologi" && (
            <Input
              {...register("rm")}
              label="RM"
              onChange={handleInputChange("rm")}
            />
          )}
        </div>

        {/* second column */}
        {selectedDivisi !== "" && (
          <div className="flex flex-col gap-3">
            {selectedDivisi === "radiologi" && (
              <Input
                {...register("tanggalTindakan")}
                label="Tanggal Tindakan"
                onChange={handleInputChange("tanggalTindakan")}
              />
            )}

            <AutocompleteSearch
              data={rsData}
              label="Nama Rumah Sakit"
              rsData={handleRSChange}
            />
          </div>
        )}

        {/* third column */}
        {selectedDivisi !== "" && (
          <div className="flex flex-col gap-3">
            <Dropdown
              data={itemNumber}
              label="Jumlah Barang"
              placeholder="Pilih jumlah barang"
            />

            <Input
              {...register("namaDokter")}
              label="Nama Dokter"
              onChange={handleInputChange("namaDokter")}
            />

            {selectedDivisi === "radiologi" && (
              <Input
                {...register("namaPasien")}
                label="Nama Pasien"
                onChange={handleInputChange("namaPasien")}
              />
            )}

            <Input
              readOnly
              {...register("alamatRumahSakit")}
              label="Alamat Rumah Sakit"
              value={alamatRumahSakit} // This will be automatically updated based on the watch
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default MainContent;
