"use client"; // Tambahkan ini di baris pertama

import { SetStateAction, useState } from "react";
import TopSectionRightSide from "./TopSectionRightSide";
import { Divider } from "@nextui-org/react";
import TableComponentPO from "../../components/Tables/AdminTable/POTable-so-dokumen";
import TableComponentPI from "../../components/Tables/AdminTable/PITable-dua-so-dokumen";

const MainContent = () => {
  const [selectedDocument, setSelectedDocument] = useState("none"); // Default value is "PO"

  const handleDocumentSelect = (document: SetStateAction<string>) => {
    setSelectedDocument(document); // Update the selected document
  };

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">

      <TopSectionRightSide onDocumentSelect={handleDocumentSelect} />

      <Divider />

      {selectedDocument === "PO" ? (
        <div className="h-full">
          <TableComponentPO />
        </div>
      ) : selectedDocument === "PI" ? (
        <div className="h-full">
          <TableComponentPI />
        </div>
      ) : (
        <div className="h-full">
          <p>Silakan pilih dokumen untuk ditampilkan.</p>
        </div>
      )}
    </div>
  );
};

export default MainContent;
