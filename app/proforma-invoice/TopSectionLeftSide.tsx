import { Input } from "@nextui-org/react";

const TopSectionLeftSide = () => (
  <div className="flex w-full flex-col justify-between">
    <h1 className="text-xl font-bold lg:text-[1.85vh]">Cari Purchase Order</h1>
    <Input type="text" placeholder="Masukan ID Purchase Order" />
  </div>
);

export default TopSectionLeftSide;
