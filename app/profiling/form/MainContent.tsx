"use client";

import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import TopSectionLeftSide from "./TopSectionLeftSide";
import { Button, Divider, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import Dropdown from "@/components/Dropdown";
import { tax_codes } from "../../../components/Tables/SalesTable/tax";
import { useEffect, useState } from "react";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import {
  resetItemProfiling,
  setItemProfiling,
} from "@/redux/features/iitemProfiling-slice";
import axios from "axios";
import { useRouter } from "next/navigation";

type FormFields = {
  name: string;
  nama_company: string;
  address_company: string;
  npwp_address: string;
  npwp: string;
  ipak_number: string;
  facture_address: string;
  city_facture: string;
  zip_code_facture: string;
  number_phone_facture: string;
  email_facture: string;
  fax_facture: string;
  pic_facture: string;
  item_address: string;
  city_item: string;
  zip_code_item: string;
  number_phone_item: string;
  email_item: string;
  fax_item: string;
  pic_item: string;
  contact_person: string;
  handphone: string;
  tax_code_id: string;
  top: string;
};

const MainContent = () => {
  const [selectedTaxCode, setSelectedTaxCode] = useState<string>("");
  const { register, setValue } = useForm<FormFields>();
  const dispatch = useDispatch<AppDispatch>();
  const profilingInput = useAppSelector(
    (state) => state.itemProfilingReducer.value,
  );
  const router = useRouter();

  const handleSubmit = async () => {
    const requestBody = {
      name: profilingInput.name,
      nama_company: profilingInput.nama_company,
      address_company: profilingInput.address_company,
      npwp_address: profilingInput.npwp_address,
      npwp: profilingInput.npwp,
      ipak_number: profilingInput.ipak_number,
      facture_address: profilingInput.facture_address,
      city_facture: profilingInput.city_facture,
      zip_code_facture: profilingInput.zip_code_facture,
      number_phone_facture: profilingInput.number_phone_facture,
      email_facture: profilingInput.email_facture,
      fax_facture: profilingInput.fax_facture,
      pic_facture: profilingInput.pic_facture,
      item_address: profilingInput.item_address,
      city_item: profilingInput.city_item,
      zip_code_item: profilingInput.zip_code_item,
      number_phone_item: profilingInput.number_phone_item,
      email_item: profilingInput.email_item,
      fax_item: profilingInput.fax_item,
      pic_item: profilingInput.pic_item,
      contact_person: profilingInput.contact_person,
      handphone: profilingInput.handphone,
      tax_code_id: selectedTaxCode,
      top: profilingInput.top,
    };

    try {
      await axios.post(
        "http://localhost:8080/api/customer-profilling/add",
        requestBody,
      );
      dispatch(resetItemProfiling());
      router.push("/profiling");
    } catch (error) {
      console.error("Error submitting data", error);
      throw error;
    }
  };
  const handleTaxCodeChange = (selectedItem: string) => {
    setSelectedTaxCode(selectedItem);
    dispatch(setItemProfiling({ tax_code_id: selectedItem }));
  };

  const divisi = useAppSelector(
    (state) => state.divisiProfilingReducer.value.divisi,
  );

  useEffect(() => {
    setValue("tax_code_id", selectedTaxCode);
  }, [selectedTaxCode, setValue]);

  const handleInputChange =
    (field: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setValue(field, value);
      dispatch(setItemProfiling({ [field]: value }));
    };

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        {/* cek profile customer and searchbar */}
        <TopSectionLeftSide />
      </ContentTopSectionLayout>
      <Divider />
      <form className="grid grid-cols-3 gap-3">
        <div className="col-span-1 flex flex-col gap-3">
          {divisi === "customer" ? (
            <Input
              {...register("name")}
              label="NAMA DOKTER"
              onChange={handleInputChange("name")}
            />
          ) : (
            <Input className="invisible" label="invisible" />
          )}
          <Input
            {...register("npwp")}
            label="NPWP"
            onChange={handleInputChange("npwp")}
          />
          <Input
            {...register("facture_address")}
            label="ALAMAT PENGIRIM FAKTUR"
            onChange={handleInputChange("facture_address")}
          />
          <Input
            {...register("pic_facture")}
            label="PIC"
            onChange={handleInputChange("pic_facture")}
          />
          <div className="flex gap-3">
            <Input
              {...register("number_phone_facture")}
              label="TLP"
              onChange={handleInputChange("number_phone_facture")}
            />
            <Input
              {...register("fax_facture")}
              label="FAX"
              onChange={handleInputChange("fax_facture")}
            />
          </div>
          <Input
            {...register("handphone")}
            label="HANDPHONE"
            onChange={handleInputChange("handphone")}
          />
        </div>
        <div className="col-span-1 flex flex-col gap-3">
          <Input
            {...register("nama_company")}
            label="NAMA RUMAH SAKIT"
            onChange={handleInputChange("nama_company")}
          />
          <Input
            {...register("ipak_number")}
            label="NO. IPAK"
            onChange={handleInputChange("ipak_number")}
          />
          <div className="flex gap-3">
            <Input
              {...register("city_facture")}
              label="KOTA"
              onChange={handleInputChange("city_facture")}
            />
            <Input
              {...register("zip_code_facture")}
              label="POS"
              onChange={handleInputChange("zip_code_facture")}
            />
          </div>
          <Input
            label="ALAMAT PENGIRIM"
            {...register("item_address")}
            onChange={handleInputChange("item_address")}
          />
          <Input label="PIC" onChange={handleInputChange("pic_item")} />
          <Dropdown
            {...register("tax_code_id")}
            data={tax_codes}
            label="KODE PAJAK"
            placeholder="Pilih Kode Pajak"
            statePassing={handleTaxCodeChange}
          />
        </div>
        <div className="col-span-1 flex flex-col gap-3">
          <Input
            {...register("address_company")}
            label="ALAMAT RUMAH SAKIT"
            onChange={handleInputChange("address_company")}
          />
          <Input
            {...register("npwp_address")}
            label="ALAMAT NPWP"
            onChange={handleInputChange("npwp_address")}
          />
          <div className="flex gap-3">
            <Input
              {...register("number_phone_item")}
              label="TLP"
              onChange={handleInputChange("number_phone_item")}
            />
            <Input
              {...register("fax_item")}
              label="FAX"
              onChange={handleInputChange("fax_item")}
            />
          </div>
          <div className="flex gap-3">
            <Input
              {...register("city_item")}
              label="KOTA"
              onChange={handleInputChange("city_item")}
            />
            <Input
              {...register("zip_code_item")}
              label="POS"
              onChange={handleInputChange("zip_code_item")}
            />
          </div>
          <Input
            {...register("contact_person")}
            label="CONTACT PERSON"
            onChange={handleInputChange("contact_person")}
          />
          <Input
            {...register("top")}
            label="TERM OF PAYMENT"
            onChange={handleInputChange("top")}
          />
        </div>
      </form>
      <div className="flex justify-end">
        <Button color="primary" className="min-w-36" onClick={handleSubmit}>
          SUBMIT
        </Button>
      </div>
    </div>
  );
};

export default MainContent;
