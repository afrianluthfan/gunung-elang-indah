import React, { FC } from "react";
import SOTableComponent from "../../components/Tables/AdminTable/SOTable";

interface TableComponentProps {}

const TableComponent: FC<TableComponentProps> = ({}) => {
  return (
    <div className="h-full">
      <SOTableComponent selectedDocument={""} />
    </div>
  );
};

export default TableComponent;
