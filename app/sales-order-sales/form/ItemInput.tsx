import { Button, Divider, Input } from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setListItemPO } from "../../../redux/features/listItemPO-slice";
import { useRouter } from "next/navigation";
import TopSectionItemList from "./TopSectionItemLIst";
import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import ContentTopSectionLayout from "../../../components/layouts/TopSectionLayout";
import { AppDispatch } from "../../../redux/store";

interface ItemInputProps {
  itemNumber: number;
  index: number;
}

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

type ListItemPOState = {
  price: string;
  quantity: string;
  name: string;
  discount: string;
};

const ItemInput: FC<ItemInputProps> = ({ itemNumber, index }) => {
  const { control, handleSubmit, watch } = useForm<ListItemPOState>();
  const [itemData, setItemData] = useState<ItemData[]>([]);
  const [selectedData, setselectedData] = useState<{}>("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const watchFields = watch();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await axios.post(
          `${apiUrl}/stock-barang/list`,
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
    dispatch(setListItemPO({ index, item: watchFields }));
  }, [watchFields, index, dispatch]);

  const handleSetData = () => {
    dispatch(setListItemPO({ index, item: watchFields }));
    router.push("/proforma-invoice/form/preview");
  };

  const findItemByName = (name: string): ItemData | undefined => {
    return itemData.find((item) => item.name === name);
  };

  const handleItemSelection = (data: ItemData) => {
    setselectedData(data);
    console.log("selectedData: ", selectedData);
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
            name="name"
            control={control}
            render={({ field }) => <Input {...field} label="NAMA BARANG" />}
          />
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => <Input {...field} label="QUANTITY" />}
          />
        </div>
        {/* second column */}
        <div className="flex flex-col gap-3">
          <Controller
            name="discount"
            control={control}
            render={({ field }) => <Input {...field} label="DISCOUNT" />}
          />
        </div>
        {/* third column */}
        <div className="flex flex-col gap-3">
          <Controller
            name="price"
            control={control}
            render={({ field }) => <Input {...field} label="PRICE" />}
          />
        </div>
      </form>
    </div>
  );
};

export default ItemInput;
