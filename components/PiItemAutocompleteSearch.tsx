"use client";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import React, { FC, useEffect, useState, useCallback } from "react";

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
    if (selectData) {
      setData(selectData);
    }
  }, [selectData]); // Only run when selectData changes

  useEffect(() => {
    if (assignedValue && data.length > 0) {
      const selectedItem = data.find((item) => item.name === assignedValue);
      if (selectedItem) {
        passingFunction(selectedItem);
      }
    }
  }, [assignedValue, data]); // This effect runs when assignedValue or data changes

  const handleSelectionChange = useCallback(
    (value: string) => {
      const selectedItem = data.find((item) => item.name === value);
      if (selectedItem) {
        passingFunction(selectedItem);
      } else {
        console.log("No matching item found in data.");
      }
    },
    [data, passingFunction],
  );

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
