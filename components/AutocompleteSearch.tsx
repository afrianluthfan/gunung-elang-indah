"use client";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import React, { FC, useEffect, useState } from "react";

interface AutocompleteSearchProps {
  data: { id: number; name: string; address_company: string }[];
  label: string;
  correspondingCity: (address: string) => void;
}

const AutocompleteSearch: FC<AutocompleteSearchProps> = ({
  data,
  label,
  correspondingCity,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null); // State to hold selected value

  // Handle selection change
  const handleSelectionChange = (key: string | number | symbol | null) => {
    if (key === null) {
      setSelectedValue(null);
      correspondingCity(""); // Clear corresponding city
    } else {
      const selectedValue = key.toString();
      setSelectedValue(selectedValue); // Update selected value
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
          <AutocompleteItem key={item.id} value={item.name}>
            {item.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
};

export default AutocompleteSearch;
