import { ReactNode } from "react";

const MainContentLayout = ({ children }: Readonly<{ children: ReactNode }>) => (
  <div className="flex h-[88.5vh] w-full items-center justify-center px-[1.6vw] py-[4vh]">
    <div className="h-full w-full rounded-xl bg-white">{children}</div>
  </div>
);

export default MainContentLayout;
