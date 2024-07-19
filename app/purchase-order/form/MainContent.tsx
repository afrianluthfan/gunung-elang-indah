"use client";

import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import TopSectionLeftSide from "./TopSectionLeftSide";
import { Button, Divider, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { itemNumber } from "./itemNumber";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { resetItemPO, setItemPO } from "@/redux/features/itemPo-slice";
import { FC, useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import axios from "axios";
import RsAutocompleteSearch from "@/components/RsAutocompleteSearch";

type ItemDetail = {
  name: string;
  quantity: string;
  price: string;
  discount: string;
};

type FormFields = {
  to_supplier: string;
  note: string;
  prepared_by: string;
  jabatan: string;
  jumlah_barang: string;
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

  const handleInputChange =
    (field: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setValue(field, value);
      dispatch(setItemPO({ [field]: value }));
    };

  useEffect(() => {
    const subscription = watch((value) => {
      dispatch(setItemPO(value));
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

          <div className="flex w-full gap-3">
            <Input
              {...register("approved_by")}
              label="Approved By"
              onChange={handleInputChange("approved_by")}
            />

            <Input
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
