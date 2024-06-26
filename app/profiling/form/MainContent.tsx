"use client";

import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import TopSectionLeftSide from "./TopSectionLeftSide";
import { Button, Divider, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import Dropdown from "@/components/Dropdown";
import { tax_codes } from "../../../components/Tables/SalesTable/tax";
import { useEffect, useState } from "react";

type FormFields = {
  name: string;
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
  const handleTaxCodeChange = (selectedItem: string) => {
    setSelectedTaxCode(selectedItem);
  };

  useEffect(() => {
    setValue("tax_code_id", selectedTaxCode);
  }, [selectedTaxCode, setValue]);

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        {/* cek profile customer and searchbar */}
        <TopSectionLeftSide />
      </ContentTopSectionLayout>
      <Divider />
      <form className="grid h-full w-full grid-cols-3 gap-3">
        <div className="flex flex-col gap-3">
          <Input {...register("name")} label="NAMA" />
          <Input {...register("npwp")} label="NPWP" />
          <Input
            {...register("facture_address")}
            label="ALAMAT PENGIRIM FAKTUR"
          />
          <Input {...register("pic_facture")} label="PIC" />
          <div className="flex justify-between gap-3">
            <Input {...register("number_phone_facture")} label="TLP" />
            <Input {...register("fax_facture")} label="FAX" />
          </div>
          <Input {...register("handphone")} label="HANDPHONE" />
        </div>
        <div className="flex flex-col gap-3">
          <Input {...register("name")} label="NAMA PERUSAHAAN" />
          <Input {...register("ipak_number")} label="NO. IPAK" />
          <div className="flex justify-between gap-3">
            <Input {...register("city_facture")} label="KOTA" />
            <Input {...register("zip_code_facture")} label="POS" />
          </div>
          <Input label="ALAMAT PENGIRIM" />
          <Input label="PIC" />
          <Dropdown
            {...register("tax_code_id")}
            data={tax_codes}
            label="KODE PAJAK"
            placeholder="Pilih Kode Pajak"
            statePassing={handleTaxCodeChange}
          />
        </div>
        <div className="flex flex-col gap-3">
          <Input {...register("address_company")} label="ALAMAT PERUSAHAAN" />
          <Input {...register("npwp_address")} label="ALAMAT NPWP" />
          <div className="flex justify-between gap-3">
            <Input {...register("number_phone_item")} label="TLP" />
            <Input {...register("fax_item")} label="FAX" />
          </div>
          <div className="flex justify-between gap-3">
            <Input {...register("city_item")} label="KOTA" />
            <Input {...register("zip_code_item")} label="POS" />
          </div>
          <Input {...register("contact_person")} label="CONTACT PERSON" />
          <Input {...register("top")} label="TERM OF PAYMENT" />
        </div>
      </form>
      <div className="flex justify-end">
        <Button color="primary" className="min-w-36">
          SUBMIT
        </Button>
      </div>
    </div>
  );
};

export default MainContent;
