"use client";

import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import TopSectionLeftSide from "./TopSectionLeftSide";
import TopSectionRightSide from "./TopSectionRightSide";
import { Divider } from "@nextui-org/react";
import DataPerusahaan from "./DataPerusahaan";
import RiwayatOrderBarang from "./RiwayatOrderBarang";
import { useState, useEffect } from "react";

const MainContent = () => {
  const [isFoundState, setIsFoundState] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<{
    name: string;
    address: string;
  }>({ name: "", address: "" });

  const [content, setContent] = useState<JSX.Element>(<></>);

  useEffect(() => {
    if (isFoundState && selectedData.name && selectedData.address) {
      setContent(
        <>
          <DataPerusahaan data={selectedData} />
          <RiwayatOrderBarang />
        </>,
      );
    } else {
      setContent(<></>);
    }
  }, [isFoundState, selectedData]);

  const searchData = () => {
    if (selectedData.name && selectedData.address) {
      setIsFoundState(true);
    } else {
      setIsFoundState(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        {/* cek profile customer and searchbar */}
        <TopSectionLeftSide setSelectedData={setSelectedData} />
        {/* the two buttons on the right */}
        <TopSectionRightSide search={searchData} />
      </ContentTopSectionLayout>
      {/* dividing line */}
      <Divider />
      {content}
    </div>
  );
};

export default MainContent;
