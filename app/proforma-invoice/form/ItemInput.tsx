"use client";

import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import { Button, Divider, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setListItemPI } from "@/redux/features/listItemPI-slice";
import { useRouter } from "next/navigation";
import TopSectionItemList from "./TopSectionItemLIst";

type FormFields = {
  kat: string;
  hSatuan: string;
  namaBarang: string;
  disc: string;
  qty: string;
  subTotal: string;
};

const ItemInput = () => {
  const { register, handleSubmit, getValues } = useForm<FormFields>();

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleSetData = () => {
    dispatch(setListItemPI(getValues()));
    router.push("/proforma-invoice/form/preview");
  };

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        {/* cek profile customer and searchbar */}
        <TopSectionItemList />
      </ContentTopSectionLayout>
      <Divider />
      <form className="grid h-full w-full grid-cols-3 gap-3">
        {/* first column */}
        <div className="flex flex-col gap-3">
          <Input {...register("kat")} label="KAT." />
          <Input {...register("hSatuan")} label="H. SATUAN" />
        </div>
        {/* second column */}
        <div className="flex flex-col gap-3">
          <Input {...register("namaBarang")} label="NAMA BARANG" />
          <Input {...register("disc")} label="DISC" />
        </div>
        {/* third column */}
        <div className="flex flex-col gap-3">
          <Input {...register("qty")} label="QTY" />
          <Input {...register("subTotal")} label="SUB TOTAL" />
        </div>
      </form>
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit(handleSetData)}
          color="primary"
          className="min-w-36"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ItemInput;
