import { ReactNode } from "react";

const MainContentLayout = ({ children }: Readonly<{ children: ReactNode }>) => (
  <div className="flex h-fit w-full flex-col items-center justify-center px-[1.6vw] pb-[4vh] pt-[4vh] lg:h-[88.5vh] lg:pb-0">
    <div className="h-full w-full rounded-xl bg-white">{children}</div>
    <div className="flex items-center justify-center text-end font-semibold lg:h-[4vh]">
      <h1 className="text-sm lg:text-lg">Supported by PT Gunung Elang Indah</h1>
    </div>
  </div>
);

export default MainContentLayout;
