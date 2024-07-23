import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import TopSectionLeftSide from "./TopSectionLeftSide";
import TopSectionRightSide from "./TopSectionRightSide";
import { Button, Divider, Input } from "@nextui-org/react";
import TableComponent from "@/components/Tables/AdminTable/POTable";

const MainContent = () => (
  <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
    
    <ContentTopSectionLayout>
      {/* cek profile customer and searchbar */}
      <TopSectionLeftSide />
      
      {/* the two buttons on the right */}
      <TopSectionRightSide />
      
    </ContentTopSectionLayout>
    <Input type="text" placeholder="Masukan ID Purchase Order" />
    <Button className="bg-[#00186D] font-bold text-white">Cari/Cek</Button>
    {/* dividing line */}
    <Divider />


    
    <div className="h-full">
      <TableComponent />
    </div>
  </div>
);

export default MainContent;
