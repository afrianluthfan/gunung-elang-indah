import SOTableComponent from "../../components/Tables/AdminTable/SOTable";
import React, { FC } from "react";

interface TableComponentProps {
  selectedDocument: string; // Tambahkan props untuk pilihan dokumen
}

const TableComponent: FC<TableComponentProps> = ({ selectedDocument }) => {
  return (
    <div className="h-full">
      {/* Kirim selectedDocument ke SOTableComponent */}
      <SOTableComponent selectedDocument={selectedDocument} />
    </div>
  );
};

export default TableComponent;
