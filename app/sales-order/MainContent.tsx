import TopSectionLeftSide from "./TopSectionLeftSide";
import TopSectionRightSide from "./TopSectionRightSide";
import { Divider } from "@nextui-org/react";
import TableComponent from "./TableComponent";
import ContentTopSectionLayout from "../../components/layouts/TopSectionLayout";

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
    <TableComponent />
  </div>
);

export default MainContent;
