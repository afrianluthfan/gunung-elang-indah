"use client";

import RsAutocompleteSearch from "@/components/RsAutocompleteSearch";
import axios from "axios";
import { FC, useEffect, useState } from "react";

interface TopSectionLeftSideProps {
  isFound: (isFoundState: boolean) => void;
  selectedData: (data: { name: string; address: string }) => void;
}

const TopSectionLeftSide: FC<TopSectionLeftSideProps> = ({
  isFound,
  selectedData,
}) => {
  const [rsData, setRsData] = useState<
    { id: number; name: string; address_company: string }[]
  >([]);

  const handleRSChange = (name: string, address: string) => {
    console.log(name, address);
    if (name && address) {
      isFound(true);
      selectedData({ name, address });
    } else {
      isFound(false);
    }
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
