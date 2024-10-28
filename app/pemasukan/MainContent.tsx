import TableComponent from "@/components/Tables/FinanceTable/TablePemasukan";

const MainContent = () => (
  <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
    <div className="h-full">
      <TableComponent />
    </div>
  </div>
);

export default MainContent;
