"use client"; // Tambahkan ini di baris pertama

import { SetStateAction, useState } from "react";
import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import TopSectionLeftSide from "./TopSectionLeftSide";
import TopSectionRightSide from "./TopSectionRightSide";
import { Divider } from "@nextui-org/react";
import TableComponent from "./TableComponent";

const MainContent = () => {
  const [selectedDocument, setSelectedDocument] = useState("none"); // Default value is "PO"

  const handleDocumentSelect = (document: SetStateAction<string>) => {
    setSelectedDocument(document); // Update the selected document
  };

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        {/* cek profile customer and searchbar */}
        <TopSectionLeftSide />
        {/* the two buttons on the right */}
        <TopSectionRightSide onDocumentSelect={handleDocumentSelect} />
      </ContentTopSectionLayout>
      {/* dividing line */}
      <Divider />
      <TableComponent selectedDocument={selectedDocument} /> {/* Pass the selected document to TableComponent */}
    </div>
  );
};

export default MainContent;
