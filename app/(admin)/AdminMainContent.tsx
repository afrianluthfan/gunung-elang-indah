import ContentTopSectionLayout from "../../components/layouts/TopSectionLayout";
import TopSectionLeftSide from "../proforma-invoice-dua/TopSectionLeftSide";
import TopSectionRightSide from "../proforma-invoice-dua/TopSectionRightSide";
import { Divider } from "@nextui-org/react";
import TableComponent from "../../components/Tables/AdminTable/Table";

const AdminMainContent = () => (
  <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
    <ContentTopSectionLayout>
      {/* cek profile customer and searchbar */}
      <TopSectionLeftSide />
      {/* the two buttons on the right */}
      <TopSectionRightSide />
    </ContentTopSectionLayout>
    {/* dividing line */}
    <Divider />
    <div className="h-full">
      <TableComponent />
    </div>
  </div>
);

export default AdminMainContent;
