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
import RsAutocompleteSearch from "@/components/RsAutocompleteSearch";

type ItemDetail = {
  description: number;
  price_idr: string;
  subTotal: string;
  gudang: string;
  qty: string;
  disc: string;
  ppn_11: string;
  unit: string;
  amount_idr: string;
  total: string;
};

type FormFields = {
  to_supplier: string;
  note: string;
  nomor_po: string;
  prepared_by: string;
  jabatan: string;
  jumlah_barang: string;
  tanggal: string;
  approved_by: string;
  jabatan_approve: string;
  item: ItemDetail[];
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

  const handleInputChange =
    (field: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setValue(field, value);
      dispatch(setItemPI({ [field]: value }));
    };

  useEffect(() => {
    const subscription = watch((value) => {
      dispatch(setItemPI(value));
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

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
          {/* <Dropdown
            data={[
              { value: "radiologi", label: "Radiologi" },
              { value: "ortopedi", label: "Ortopedi" },
            ]}
            label="Divisi"
            placeholder="Pilih Divisi"
            statePassing={handleDivisiChange}
          /> */}

          <Input label="invisible" className="invisible" />

          <Input
            {...register("to_supplier")}
            label="To Supplier"
            onChange={handleInputChange("to_supplier")}
          />

          <Input
            {...register("note")}
            label="Note"
            onChange={handleInputChange("note")}
          />
        </div>

        {/* second column */}

        <div className="flex flex-col gap-3">
          <Input label="invisible" className="invisible" />
          <Input
            {...register("nomor_po")}
            label="Nomor PO"
            onChange={handleInputChange("nomor_po")}
          />
          <div className="flex w-full gap-3">
            <Input
              {...register("prepared_by")}
              label="Prepared By"
              onChange={handleInputChange("prepared_by")}
            />
            <Input
              {...register("jabatan")}
              label="Jabatan"
              onChange={handleInputChange("jabatan")}
            />
          </div>
        </div>

        {/* third column */}

        <div className="flex flex-col gap-3">
          <Dropdown
            data={itemNumber}
            label="Jumlah Barang"
            placeholder="Pilih jumlah barang"
          />

          <Input
            {...register("tanggal")}
            label="Tanggal"
            onChange={handleInputChange("tanggal")}
          />

          <div className="flex w-full gap-3">
            <Input
              {...register("approved_by")}
              label="Approved By"
              onChange={handleInputChange("approved_by")}
            />

            <Input
              readOnly
              {...register("jabatan_approve")}
              label="Jabatan"
              onChange={handleInputChange("jabatan_approve")}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default MainContent;
