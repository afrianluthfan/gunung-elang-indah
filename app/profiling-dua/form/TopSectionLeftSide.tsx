
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setDivisiProfiling } from "../../../redux/features/divisiProfiling-slice";
import { AppDispatch } from "../../../redux/store";
import Dropdown from "../../../components/Dropdown";

const TopSectionLeftSide = () => {
  const data = [
    {
      label: "Supplier",
      value: "supplier",
    },
    {
      label: "Customer",
      value: "customer",
    },
    {
      label: "Customer Non Rumah Sakit",
      value: "customer non rumah sakit",
    },
  ];

  const dispatch = useDispatch<AppDispatch>();

  const handleDivisiChange = (selectedItem: string) => {
    dispatch(setDivisiProfiling(selectedItem));
  };

  return (
    <div className="flex w-full flex-row justify-between">
      <h1 className="text-xl font-bold lg:text-[1.85vh]">Form Profiling</h1>
      <div className="w-[20%]">
        <Dropdown
          data={data}
          label="Divisi"
          placeholder="Pilih Divisi"
          statePassing={handleDivisiChange}
        />
      </div>
    </div>
  );
};

export default TopSectionLeftSide;
