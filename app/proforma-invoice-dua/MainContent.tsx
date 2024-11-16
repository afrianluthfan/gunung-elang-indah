"use client";

import { useEffect, useState } from "react";
import ContentTopSectionLayout from "../../components/layouts/TopSectionLayout";
import TableComponentsales from "../../components/Tables/AdminTable/PITable-dua-sales";
import TableComponent from "../../components/Tables/AdminTable/PITable-dua";
import TopSectionLeftSide from "./TopSectionLeftSide";
import TopSectionRightSide from "./TopSectionRightSide";

const MainContent = () => {
  const [role, setRole] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("statusAccount") || "");
    }
  }, []);

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        {/* cek profile customer and searchbar */}
        <TopSectionLeftSide />

        {/* the two buttons on the right */}
        <TopSectionRightSide />
      </ContentTopSectionLayout>

      <div className="h-full ">
        {role === "SALES" ? (
          <TableComponentsales />
        ) : (
          <TableComponent />
        )}
      </div>    </div>
  );
};

export default MainContent;