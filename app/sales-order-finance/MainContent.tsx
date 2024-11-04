import ContentTopSectionLayout from "../../components/layouts/TopSectionLayout";
import TableComponent from "../../components/Tables/AdminTable/POTable-so";
import TopSectionLeftSide from "./TopSectionLeftSide";
import TopSectionRightSide from "./TopSectionRightSide";
import { Button, Divider, Input } from "@nextui-org/react";

const MainContent = () => (
  <div className="flex h-full w-full flex-col justify-between gap-6 p-8">

    <ContentTopSectionLayout>
      {/* cek profile customer and searchbar */}
      <TopSectionLeftSide />

      {/* the two buttons on the right */}
      <TopSectionRightSide />

    </ContentTopSectionLayout>


    <div className="h-full">
      <TableComponent />
    </div>
  </div>

);

export default MainContent;
