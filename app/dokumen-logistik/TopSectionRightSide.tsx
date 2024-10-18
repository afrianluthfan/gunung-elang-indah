import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";

const TopSectionRightSide = ({ onDocumentSelect }: { onDocumentSelect: (value: string) => void }) => {
  const [selectedValue, setSelectedValue] = useState("none"); // Set default value to "none"

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value); // Update the state
    onDocumentSelect(value); // Send the selected value to the parent component
  };

  // // Reset selected value to "none" when the component mounts
  // useEffect(() => {
  //   setSelectedValue("none");
  //   onDocumentSelect("none"); // Send "none" to the parent
  // }, [onDocumentSelect]); // Tambahkan onDocumentSelect ke dalam array dependensi

  return (
    <div className="flex flex-row justify-between">
      <div>
        <h1 className="font-bold text-black">Dokumen Logistik</h1>
      </div>
      <div>
        <select
          className="bg-[#ffffff] text-black p-2 rounded-md border"
          value={selectedValue} // Bind select value to state
          onChange={handleSelectChange}
        >
          <option value="none">Pilih Data Dokumen</option>
          <option value="PO">Purchase Order</option>
          <option value="PI">Proforma Invoice</option>
        </select>
      </div>
    </div>

  );
};

export default TopSectionRightSide;
