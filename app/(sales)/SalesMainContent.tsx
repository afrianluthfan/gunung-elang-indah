"use client";

import ContentTopSectionLayout from "../../components/layouts/TopSectionLayout";
import TopSectionLeftSide from "../proforma-invoice-dua/TopSectionLeftSide";
import TopSectionRightSide from "../proforma-invoice-dua/TopSectionRightSide";
import { Divider } from "@nextui-org/react";
import PITableComponent from "../../components/Tables/SalesTable/PITable";
import { usePathname } from "next/navigation";

const SalesMainContent = () => {
  const currentPath = usePathname();
  let TableComponent = <></>;
  switch (currentPath) {
    case "/profiling":
      break;
    case "/proforma-invoice":
      TableComponent = <PITableComponent />;
      break;
  }

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        {/* cek profile customer and searchbar */}
        <TopSectionLeftSide />
        {/* the two buttons on the right */}
        <TopSectionRightSide />
      </ContentTopSectionLayout>
      {/* dividing line */}
      <Divider />
      <div className="h-full">{TableComponent}</div>
    </div>
  );
};

export default SalesMainContent;
