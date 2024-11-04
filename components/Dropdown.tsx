import React, { FC, useEffect } from "react";
import { Select, SelectItem, Selection } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { setAmount } from "../redux/features/salesPIItemNumber-slice";

interface DropdownProps {
  data: { value: string; label: string }[];
  label: string;
  placeholder: string;
  statePassing?: (selectedItem: string) => void;
  selectedKeys?: Selection;
}

type Key = string | number;

const Dropdown: FC<DropdownProps> = ({
  data,
  label,
  placeholder,
  statePassing,
  selectedKeys,
}) => {
  const [value, setValue] = React.useState<Selection>(
    selectedKeys || new Set([]),
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setAmount(0));
  }, [dispatch]);

  const handleSelect = (selectedKeys: Selection) => {
    setValue(selectedKeys);
    const selectedValue = Array.from(selectedKeys).join(", ");
    if (!isNaN(Number(selectedValue))) {
      dispatch(setAmount(Number(selectedValue)));
    }
    if (statePassing) {
      statePassing(selectedValue);
    }
  };

  return (
    <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
      <Select
        label={label}
        placeholder={placeholder}
        selectedKeys={selectedKeys || value}
        onSelectionChange={handleSelect}
      >
        {data.map((item) => (
          <SelectItem className="text-black" key={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default Dropdown;
