import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import TopSectionLeftSide from "./TopSectionLeftSide";
import TopSectionRightSide from "./TopSectionRightSide";
import { Divider } from "@nextui-org/react";
import TableComponent from "@/components/Tables/SalesTable/TableStockSales";

const MainContent = () => (
  <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
    <ContentTopSectionLayout>
      {/* cek profile customer and searchbar */}
      <TopSectionLeftSide />
      {/* the two buttons on the right */}
      <TopSectionRightSide />
    </ContentTopSectionLayout>
    {/* dividing line */}
    <Divider />
    <div className="h-full overflow-x-scroll">
      <TableComponent />
    </div>
  </div>
);

export default MainContent;
