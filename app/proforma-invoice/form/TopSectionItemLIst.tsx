import { FC } from "react";

interface TopSectionItemLIstProps {
  itemNumber: number;
}

const TopSectionItemList: FC<TopSectionItemLIstProps> = ({ itemNumber }) => (
  <div className="flex w-full flex-col justify-between">
    <h1 className="text-xl font-bold lg:text-[1.85vh]">{`Barang ${itemNumber}`}</h1>
  </div>
);

export default TopSectionItemList;
