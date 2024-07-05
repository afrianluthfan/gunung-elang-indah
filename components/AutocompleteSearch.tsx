"use client";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import React, { FC, useState } from "react";

interface AutocompleteSearchProps {
  data: { id: number; name: string; address_company: string }[];
  label: string;
  rsData: (rsName: string, address: string) => void;
}

const AutocompleteSearch: FC<AutocompleteSearchProps> = ({
  data,
  label,
  rsData,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null); // State to hold selected value

  // Handle selection change
  const handleSelectionChange = (key: string | number | symbol | null) => {
    if (key === null) {
      console.log("key null");
      setSelectedValue(null);
      rsData("", ""); // Clear corresponding city
    } else {
      const selectedValue = key.toString();
      setSelectedValue(selectedValue); // Update selected value

      const selectedItem = data.find(
        (item) => item.id === parseInt(selectedValue),
      );
      if (selectedItem) {
        rsData(selectedItem.name, selectedItem.address_company); // Pass selected value to parent component
      } else {
        console.log("No matching item found in data.");
      }
    }
  };

  return (
    <div>
      <Autocomplete
        labelPlacement="inside"
        label={label}
        value={selectedValue as string} // Type assertion to string
        onSelectionChange={handleSelectionChange}
      >
        {data.map((item) => (
          <AutocompleteItem
            className="text-black"
            key={item.id}
            value={item.name}
          >
            {item.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
};

export default AutocompleteSearch;
