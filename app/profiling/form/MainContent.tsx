"use client";

import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import TopSectionLeftSide from "./TopSectionLeftSide";
import { Button, Divider, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";

type FormFields = {
  nama: string;
  npwp: string;
  alamatPengirimFaktur: string;
  pic: string;
  tlp: string;
  fax: string;
  handphone: string;
  verifikasi: string;
  namaPerusahaan: string;
  noIpak: string;
  kota: string;
  pos: string;
  alamatPengirim: string;
  kodePajak: string;
  pembuatCp: string;
  alamatPerusahaan: string;
  alamatNpwp: string;
  contactPerson: string;
  termOfPayment: string;
};

const MainContent = () => {
  const { register } = useForm<FormFields>();

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        {/* cek profile customer and searchbar */}
        <TopSectionLeftSide />
      </ContentTopSectionLayout>
      <Divider />
      <form className="grid h-full w-full grid-cols-3 gap-3">
        <div className="flex flex-col gap-3">
          <Input {...register("nama")} label="NAMA" />
          <Input {...register("npwp")} label="NPWP" />
          <Input
            {...register("alamatPengirimFaktur")}
            label="ALAMAT PENGIRIM FAKTUR"
          />
          <Input {...register("pic")} label="PIC" />
          <div className="flex justify-between gap-3">
            <Input {...register("tlp")} label="TLP" />
            <Input {...register("fax")} label="FAX" />
          </div>
          <Input {...register("handphone")} label="HANDPHONE" />
          <Input {...register("verifikasi")} label="VERIFIKASI" />
        </div>
        <div className="flex flex-col gap-3">
          <Input {...register("namaPerusahaan")} label="NAMA PERUSAHAAN" />
          <Input {...register("noIpak")} label="NO. IPAK" />
          <div className="flex justify-between gap-3">
            <Input {...register("kota")} label="KOTA" />
            <Input {...register("pos")} label="POS" />
          </div>
          <Input label="ALAMAT PENGIRIM" />
          <Input label="PIC" />
          <Input {...register("kodePajak")} label="KODE PAJAK" />
          <Input {...register("pembuatCp")} label="PEMBUAT CP" />
        </div>
        <div className="flex flex-col gap-3">
          <Input {...register("alamatPerusahaan")} label="ALAMAT PERUSAHAAN" />
          <Input {...register("alamatNpwp")} label="ALAMAT NPWP" />
          <div className="flex justify-between gap-3">
            <Input label="TLP" />
            <Input label="FAX" />
          </div>
          <div className="flex justify-between gap-3">
            <Input label="KOTA" />
            <Input label="POS" />
          </div>
          <Input {...register("contactPerson")} label="CONTACT PERSON" />
          <Input {...register("termOfPayment")} label="TERM OF PAYMENT" />
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
