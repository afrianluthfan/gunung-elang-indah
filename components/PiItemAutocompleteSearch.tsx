"use client";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import React, { FC, useState } from "react";

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

interface PiItemAutocompleteSearchProps {
  data: ItemData[];
  label: string;
  passingFunction: (itemData: ItemData) => void;
}

const PiItemAutocompleteSearch: FC<PiItemAutocompleteSearchProps> = ({
  data,
  label,
  passingFunction,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null); // State to hold selected value

  // Handle selection change
  const handleSelectionChange = (value: string) => {
    setSelectedValue(value); // Update selected value

    const selectedItem = data.find((item) => item.name === value);
    if (selectedItem) {
      passingFunction(selectedItem); // Pass selected item to parent component
      console.log("Selected item: ", selectedItem);
    } else {
      console.log("No matching item found in data.");
      console.log("Selected name: ", value);
    }
  };

  return (
    <div>
      <Autocomplete
        labelPlacement="inside"
        label={label}
        value={selectedValue || ""} // Ensure value is a string
        onSelectionChange={(key) => handleSelectionChange(key as string)}
      >
        {data.map((item) => (
          <AutocompleteItem
            className="text-black"
            key={item.id}
            value={item.name} // Use item.name as the value
          >
            {item.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
};

export default PiItemAutocompleteSearch;
