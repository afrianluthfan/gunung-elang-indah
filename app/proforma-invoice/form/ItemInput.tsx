"use client";
import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import { Button, Divider, Input } from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setListItemPI } from "@/redux/features/listItemPI-slice";
import { useRouter } from "next/navigation";
import TopSectionItemList from "./TopSectionItemLIst";
import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import PiItemAutocompleteSearch from "@/components/PiItemAutocompleteSearch";

interface ItemInputProps {
  itemNumber: number;
  index: number;
}

type ItemData = {
  id: number;
  name: string;
  total: string;
  price: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
};

type ListItemPIState = {
  kat: string;
  hSatuan: string;
  namaBarang: string;
  disc: string;
  qty: string;
  subTotal: string;
};

const ItemInput: FC<ItemInputProps> = ({ itemNumber, index }) => {
  const { control, handleSubmit, watch, setValue } = useForm<ListItemPIState>();
  const [itemData, setItemData] = useState<ItemData[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const watchFields = watch();

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/stock-barang/list",
          "",
        );
        setItemData(response.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchItemData();
  }, []);

  useEffect(() => {
    dispatch(setListItemPI({ index, item: watchFields }));
  }, [watchFields, index, dispatch]);

  const handleSetData = () => {
    dispatch(setListItemPI({ index, item: watchFields }));
    router.push("/proforma-invoice/form/preview");
  };

  const handleItemSelection = (data: ItemData) => {
    setValue("namaBarang", data.name); // Update the form field value
    dispatch(
      setListItemPI({ index, item: { ...watchFields, namaBarang: data.name } }),
    );
  };

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        {/* Check profile customer and searchbar */}
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
          <PiItemAutocompleteSearch
            selectData={itemData}
            label="Nama Barang"
            passingFunction={handleItemSelection}
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
