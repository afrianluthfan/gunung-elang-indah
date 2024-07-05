"use client";

import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import { Button, Divider, Input } from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setListItemPI } from "@/redux/features/listItemPI-slice";
import { useRouter } from "next/navigation";
import TopSectionItemList from "./TopSectionItemLIst";
import React, { FC, useEffect } from "react";

interface ItemInputProps {
  itemNumber: number;
  index: number;
}

type ListItemPIState = {
  kat: string;
  hSatuan: string;
  namaBarang: string;
  disc: string;
  qty: string;
  subTotal: string;
};

const ItemInput: FC<ItemInputProps> = ({ itemNumber, index }) => {
  const { control, handleSubmit, watch } = useForm<ListItemPIState>();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const watchFields = watch();

  useEffect(() => {
    dispatch(setListItemPI({ index, item: watchFields }));
  }, [watchFields, index, dispatch]);

  const handleSetData = () => {
    dispatch(setListItemPI({ index, item: watchFields }));
    router.push("/proforma-invoice/form/preview");
  };

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        {/* cek profile customer and searchbar */}
        <TopSectionItemList itemNumber={itemNumber} />
      </ContentTopSectionLayout>
      <Divider />
      <form
        className="grid h-full w-full grid-cols-3 gap-3"
        onSubmit={handleSubmit(handleSetData)}
      >
        {/* first column */}
        <div className="flex flex-col gap-3">
          <Controller
            name="kat"
            control={control}
            render={({ field }) => <Input {...field} label="KAT." />}
          />
          <Controller
            name="hSatuan"
            control={control}
            render={({ field }) => <Input {...field} label="H. SATUAN" />}
          />
        </div>
        {/* second column */}
        <div className="flex flex-col gap-3">
          <Controller
            name="namaBarang"
            control={control}
            render={({ field }) => <Input {...field} label="NAMA BARANG" />}
          />
          <Controller
            name="disc"
            control={control}
            render={({ field }) => <Input {...field} label="DISC" />}
          />
        </div>
        {/* third column */}
        <div className="flex flex-col gap-3">
          <Controller
            name="qty"
            control={control}
            render={({ field }) => <Input {...field} label="QTY" />}
          />
          <Controller
            name="subTotal"
            control={control}
            render={({ field }) => <Input {...field} label="SUB TOTAL" />}
          />
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
