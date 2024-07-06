import React, { FC, useEffect } from "react";
import { Select, SelectItem, Selection } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setAmount } from "@/redux/features/salesPIItemNumber-slice";
import { set } from "react-hook-form";

interface DropdownProps {
  data: { value: string; label: string }[];
  label: string;
  placeholder: string;
  statePassing?: (selectedItem: string) => void; // Update type to string
}

const Dropdown: FC<DropdownProps> = ({
  data,
  label,
  placeholder,
  statePassing,
}) => {
  const [value, setValue] = React.useState<Selection>(new Set([]));
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setAmount(0));
  }, [dispatch]);

  const handleSelect = (selectedKeys: Selection) => {
    setValue(selectedKeys);
    const selectedValue = Array.from(selectedKeys).join(", "); // Extracting value as string
    if (!isNaN(Number(selectedValue))) {
      dispatch(setAmount(Number(selectedValue))); // Dispatch the selected value as number
    }
    if (statePassing) {
      statePassing(selectedValue); // Pass the selected value as string
    }
  };

  return (
    <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
      <Select
        label={label}
        placeholder={placeholder}
        selectedKeys={value}
        onSelectionChange={handleSelect}
      >
        {data.map((data) => (
          <SelectItem className="text-black" key={data.value}>
            {data.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default Dropdown;
