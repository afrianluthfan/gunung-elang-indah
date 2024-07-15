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

type ItemData = {
  id: string;
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
};

type EditPIState = {
  kat: string;
  nama_barang: string;
  quantity: string;
  harga_satuan: string;
  discount: string;
};

interface ItemInputProps {
  itemNumber: number;
  index: number;
  itemData: EditPIState;
}

const ItemInput: FC<ItemInputProps> = ({ itemNumber, index, itemData }) => {
  const { control, handleSubmit, watch, setValue } = useForm<ListItemPIState>();
  const [itemListData, setItemListData] = useState<ItemData[]>([]);
  const [selectedData, setselectedData] = useState<{}>("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const watchFields = watch();

  useEffect(() => {
    if (itemData.nama_barang) {
      setValue("kat", itemData.kat);
      setselectedData(itemData.nama_barang);
      setValue("qty", itemData.quantity);
      setValue("hSatuan", itemData.harga_satuan);
      setValue("disc", itemData.discount);
    }
    console.log("ini jalan", selectedData);
  }, [
    itemData.nama_barang,
    itemData.kat,
    itemData.quantity,
    itemData.harga_satuan,
    itemData.discount,
    setValue,
    selectedData,
  ]);

  useEffect(() => {
    const fetchItemListData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/stock-barang/list",
          "",
        );
        setItemListData(response.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchItemListData();
  }, []);

  useEffect(() => {
    dispatch(setListItemPI({ index, item: watchFields }));
  }, [watchFields, index, dispatch]);

  const handleSetData = () => {
    dispatch(setListItemPI({ index, item: watchFields }));
    router.push("/proforma-invoice/form/preview");
  };

  const findItemByName = (name: string): ItemData | undefined => {
    return itemListData.find((item) => item.name === name);
  };

  const handleItemSelection = (data: ItemData) => {
    setselectedData(data);
    console.log("selectedData: ", selectedData);
  };

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        <TopSectionItemList itemNumber={itemNumber} />
      </ContentTopSectionLayout>
      <Divider />
      <form
        className="grid h-full w-full grid-cols-3 gap-3"
        onSubmit={handleSubmit(handleSetData)}
      >
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
        <div className="flex flex-col gap-3">
          <PiItemAutocompleteSearch
            data={itemListData}
            label="Nama Barang"
            passingFunction={handleItemSelection}
          />
          <Controller
            name="disc"
            control={control}
            render={({ field }) => <Input {...field} label="DISC" />}
          />
        </div>
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
