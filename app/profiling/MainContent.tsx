"use client";

import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import TopSectionLeftSide from "./TopSectionLeftSide";
import TopSectionRightSide from "./TopSectionRightSide";
import { Divider } from "@nextui-org/react";
import DataPerusahaan from "./DataPerusahaan";
import RiwayatOrderBarang from "./RiwayatOrderBarang";
import { useState } from "react";
import { set } from "react-hook-form";

const MainContent = () => {
  const [isFoundState, setIsFoundState] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<{
    name: string;
    address: string;
  }>(null!);

  const content = isFoundState ? (
    <>
      <DataPerusahaan data={selectedData} />
      <RiwayatOrderBarang />
    </>
  ) : null;

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        {/* cek profile customer and searchbar */}
        <TopSectionLeftSide
          isFound={setIsFoundState}
          selectedData={setSelectedData}
        />
        {/* the two buttons on the right */}
        <TopSectionRightSide />
      </ContentTopSectionLayout>
      {/* dividing line */}
      <Divider />
      {content}
    </div>
  );
};

export default MainContent;
