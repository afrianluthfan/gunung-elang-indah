"use client";

import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import { Divider, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setItemPI } from "@/redux/features/itemPI-slice";
import { FC, useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import axios from "axios";
import RsAutocompleteSearch from "@/components/RsAutocompleteSearch";
import TopSectionLeftSide from "../../TopSectionLeftSide";
import { itemNumber } from "../../form/itemNumber";

type Key = string | number;

interface MainContentProps {
  divisi?: string;
}

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

const MainContent: FC<MainContentProps> = ({ divisi }) => {
  const [selectedDivisi, setSelectedDivisi] = useState<Set<Key>>(new Set());
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

  const handleDivisiChange = (selectedItem: Set<Key>) => {
    setSelectedDivisi(selectedItem);
    const selectedValue = Array.from(selectedItem).join(", ");
    dispatch(setItemPI({ divisi: selectedValue }));
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
    if (divisi) {
      setSelectedDivisi(new Set([divisi]));
      setValue("divisi", divisi);
    }
  }, [divisi, setValue]);

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
        <TopSectionLeftSide />
      </ContentTopSectionLayout>
      <Divider />

      <form className="grid h-full w-full grid-cols-3 gap-3">
        <div className="flex flex-col gap-3">
          <Dropdown
            data={[
              { value: "radiologi", label: "Radiologi" },
              { value: "ortopedi", label: "Ortopedi" },
            ]}
            label="Divisi"
            placeholder="Pilih Divisi"
            statePassing={(selectedValue) =>
              handleDivisiChange(new Set([selectedValue]))
            }
            selectedKeys={selectedDivisi}
          />

          <Input
            {...register("jatuhTempo")}
            label="Jatuh Tempo"
            onChange={handleInputChange("jatuhTempo")}
          />

          {selectedDivisi.has("radiologi") && (
            <Input
              {...register("rm")}
              label="RM"
              onChange={handleInputChange("rm")}
            />
          )}
        </div>

        <div className="flex flex-col gap-3">
          {selectedDivisi.has("radiologi") && (
            <Input
              {...register("tanggalTindakan")}
              label="Tanggal Tindakan"
              onChange={handleInputChange("tanggalTindakan")}
            />
          )}

          <RsAutocompleteSearch
            data={rsData}
            label="Nama Rumah Sakit"
            rsData={handleRSChange}
          />
        </div>

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

          {selectedDivisi.has("radiologi") && (
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
            value={alamatRumahSakit}
          />
        </div>
      </form>
    </div>
  );
};

export default MainContent;
