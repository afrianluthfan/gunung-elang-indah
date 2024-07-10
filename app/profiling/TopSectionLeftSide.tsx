"use client";

import RsAutocompleteSearch from "@/components/RsAutocompleteSearch";
import axios from "axios";
import { FC, useEffect, useState } from "react";

interface TopSectionLeftSideProps {
  setSelectedData: (data: { name: string; address: string }) => void;
}

const TopSectionLeftSide: FC<TopSectionLeftSideProps> = ({
  setSelectedData,
}) => {
  const [rsData, setRsData] = useState<
    { id: number; name: string; address_company: string }[]
  >([]);
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const handleRSChange = (selectedName: string, selectedAddress: string) => {
    setName(selectedName);
    setAddress(selectedAddress);
    setSelectedData({ name: selectedName, address: selectedAddress });
  };

  useEffect(() => {
    const fetchRsData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/proforma-invoice/rs-list",
          "",
        );
        setRsData(response.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchRsData();
  }, []);

  return (
    <div className="flex w-full flex-col justify-between">
      <h1 className="text-xl font-bold lg:text-[1.85vh]">
        Cek Profile Customer
      </h1>
      <RsAutocompleteSearch
        data={rsData}
        label="Nama Rumah Sakit"
        rsData={handleRSChange}
      />
    </div>
  );
};

export default TopSectionLeftSide;
