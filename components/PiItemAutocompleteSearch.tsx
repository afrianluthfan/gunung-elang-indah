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

  const [inputValue, setInputValue] = useState<string>(assignedValue || "");
  const [selectedKey, setSelectedKey] = useState<string>(assignedValue || "");

  useEffect(() => {
    if (selectData) {
      setData(selectData);
    }
  }, [selectData]);

  useEffect(() => {
    if (assignedValue && data.length > 0) {
      const selectedItem = data.find((item) => item.name === assignedValue);
      if (selectedItem) {
        passingFunction(selectedItem);
        setInputValue(assignedValue);
        setSelectedKey(assignedValue);
      }
    }
  }, [assignedValue, data, passingFunction]);

  const handleSelectionChange = useCallback(
    (key: React.Key) => {
      const selectedItem = data.find((item) => item.name === key);
      if (selectedItem) {
        passingFunction(selectedItem);
        setSelectedKey(key as string);
        setInputValue(selectedItem.name);
      }
    },
    [data, passingFunction],
  );

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setSelectedKey(""); // Clear selected key when input changes
  };

  return (
    <div>
      <Autocomplete
        labelPlacement="inside"
        label={label}
        inputValue={inputValue}
        selectedKey={selectedKey}
        onInputChange={handleInputChange}
        onSelectionChange={handleSelectionChange}
        allowsCustomValue
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
