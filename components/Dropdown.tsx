import React, { FC } from "react";
import { Select, SelectItem, Selection } from "@nextui-org/react";

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

  const handleSelectionChange = (selectedKeys: Selection) => {
    setValue(selectedKeys);
    const selectedValue = Array.from(selectedKeys).join(", "); // Extracting value as string
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
        onSelectionChange={handleSelectionChange} // Updated function
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
