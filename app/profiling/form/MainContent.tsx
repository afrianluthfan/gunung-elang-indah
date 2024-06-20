import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import TopSectionLeftSide from "./TopSectionLeftSide";
import { Button, Divider, Input } from "@nextui-org/react";

const MainContent = () => (
  <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
    <ContentTopSectionLayout>
      {/* cek profile customer and searchbar */}
      <TopSectionLeftSide />
    </ContentTopSectionLayout>
    <Divider />
    <form className="grid h-full w-full grid-cols-3 gap-3">
      <div className="flex flex-col gap-3">
        <Input label="NAMA" />
        <Input label="NPWP" />
        <Input label="ALAMAT PENGIRIM FAKTUR" />
        <Input label="PIC" />
        <div className="flex justify-between gap-3">
          <Input label="TLP" />
          <Input label="FAX" />
        </div>
        <Input label="HANDPHONE" />
        <Input label="VERIFIKASI" />
      </div>
      <div className="flex flex-col gap-3">
        <Input label="NAMA PERUSAHAAN" />
        <Input label="NO. IPAK" />
        <div className="flex justify-between gap-3">
          <Input label="KOTA" />
          <Input label="POS" />
        </div>
        <Input label="ALAMAT PENGIRIM" />
        <Input label="PIC" />
        <Input label="KODE PAJAK" />
        <Input label="PEMBUAT CP" />
      </div>
      <div className="flex flex-col gap-3">
        <Input label="ALAMAT PERUSAHAAN" />
        <Input label="ALAMAT NPWP" />
        <div className="flex justify-between gap-3">
          <Input label="TLP" />
          <Input label="FAX" />
        </div>
        <div className="flex justify-between gap-3">
          <Input label="KOTA" />
          <Input label="POS" />
        </div>
        <Input label="CONTACT PERSON" />
        <Input label="TERM OF PAYMENT" />
      </div>
    </form>
    <div className="flex justify-end">
      <Button color="primary" className="min-w-36">
        SUBMIT
      </Button>
    </div>
  </div>
);

export default MainContent;
