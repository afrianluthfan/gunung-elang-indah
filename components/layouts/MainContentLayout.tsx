import { ReactNode } from "react";

const MainContentLayout = ({ children }: Readonly<{ children: ReactNode }>) => (
  <div className="flex h-[88.5vh] w-full flex-col items-center justify-center px-[1.6vw] pt-[4vh]">
    <div className="h-full w-full rounded-xl bg-white">{children}</div>
    <div className="flex h-[4vh] items-center justify-center text-end font-semibold">
      <h1>Supported by PT Gunung Elang Indah</h1>
    </div>
  </div>
);

export default MainContentLayout;
