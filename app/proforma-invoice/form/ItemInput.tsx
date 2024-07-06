"use client";

import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import { Divider, Input } from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setListItemPI } from "@/redux/features/listItemPI-slice";
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
  const { control, watch } = useForm<ListItemPIState>();
  const dispatch = useDispatch<AppDispatch>();

  const watchFields = watch();

  useEffect(() => {
    dispatch(setListItemPI({ index, item: watchFields }));
  }, [watchFields, index, dispatch]);

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        {/* cek profile customer and searchbar */}
        <TopSectionItemList itemNumber={itemNumber} />
      </ContentTopSectionLayout>
      <Divider />
      <form className="grid h-full w-full grid-cols-3 gap-3">
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
        </div>
      </form>
    </div>
  );
};

export default ItemInput;
