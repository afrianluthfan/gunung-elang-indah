"use client";
import { Autocomplete, AutocompleteItem, select } from "@nextui-org/react";
import axios from "axios";
import React, { FC, useEffect, useState } from "react";

interface PiItemAutocompleteSearchProps {
  label: string;
  assignedValue?: string;
  selectData?: {
    id: number;
    name: string;
    total: string;
    price: string;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
  }[];
  passingFunction: (itemData: {
    id: number;
    name: string;
    total: string;
    price: string;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
  }) => void;
}

const PiItemAutocompleteSearch: FC<PiItemAutocompleteSearchProps> = ({
  label,
  assignedValue,
  passingFunction,
  selectData,
}) => {
  const [data, setData] = useState<
    {
      id: number;
      name: string;
      total: string;
      price: string;
      created_at: string;
      created_by: string;
      updated_at: string;
      updated_by: string;
    }[]
  >([]);

  useEffect(() => {
    setData(selectData || []);
  });

  useEffect(() => {
    if (assignedValue && data.length > 0) {
      const selectedItem = data.find((item) => item.name === assignedValue);
      if (selectedItem) {
        passingFunction(selectedItem);
      }
    }
  }, [assignedValue, data, passingFunction]); // This effect runs when assignedValue or data changes

  const handleSelectionChange = (value: string) => {
    const selectedItem = data.find((item) => item.name === value);
    if (selectedItem) {
      passingFunction(selectedItem);
    } else {
      console.log("No matching item found in data.");
    }
  };

  return (
    <div>
      <Autocomplete
        labelPlacement="inside"
        label={label}
        defaultInputValue={assignedValue || ""}
        onSelectionChange={(key) => handleSelectionChange(key as string)}
      >
        {data.map((item) => (
          <AutocompleteItem
            className="text-black"
            key={item.name}
            value={item.name}
          >
            {item.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
};

export default PiItemAutocompleteSearch;
